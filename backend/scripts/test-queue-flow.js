const WebSocket = require('ws');
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
const WS_URL = 'ws://localhost:3001';

async function runTest() {
    try {
        console.log('--- STARTING QUEUE FLOW TEST ---');

        // 1. Login/Register
        console.log('1. Authenticating...');
        const phone = '+998901234567';
        // Request OTP
        await axios.post(`${API_URL}/auth/request-otp`, { phone });

        // Verify OTP (using master code 12345)
        const authRes = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp: '12345' });
        const token = authRes.data.data.token;
        const userId = authRes.data.data.user.id;
        console.log('   Authenticated! Token:', token.substring(0, 10) + '...');

        // 2. Create Organization (if needed, or use existing)
        console.log('2. Getting/Creating Organization...');
        // Let's just create one to be sure
        const orgRes = await axios.post(`${API_URL}/orgs`, {
            name: 'Test Org ' + Date.now(),
            category: 'Bank',
            ownerId: userId
        }, { headers: { Authorization: `Bearer ${token}` } });
        const orgId = orgRes.data.data.id;
        console.log('   Organization ID:', orgId);

        // 3. Connect WebSocket
        console.log('3. Connecting WebSocket...');
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        await new Promise((resolve, reject) => {
            ws.on('open', () => {
                console.log('   WS Connected!');
                // Subscribe to Org
                ws.send(JSON.stringify({ type: 'SUBSCRIBE', orgId }));
                resolve();
            });
            ws.on('error', reject);
        });

        // 4. Join Queue
        console.log('4. Joining Queue...');
        // We need to listen for the event BEFORE joining to catch it
        const eventPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('WS Event Timeout')), 5000);
            ws.on('message', (data) => {
                const event = JSON.parse(data.toString());
                console.log('   WS Event Received:', event.type);
                if (event.type === 'QUEUE_JOINED' && event.data.organizationId === orgId) {
                    clearTimeout(timeout);
                    resolve(event.data);
                }
            });
        });

        const joinRes = await axios.post(`${API_URL}/queues/join`, {
            organizationId: orgId,
            userPhone: phone,
            userName: 'Test User'
        }, { headers: { Authorization: `Bearer ${token}` } });

        console.log('   Joined Queue! Ticket:', joinRes.data.data.number);

        // 5. Verify WS Event
        console.log('5. Waiting for WS Update...');
        const eventData = await eventPromise;
        console.log('   SUCCESS! Received Queue Update via WebSocket:', eventData.number);

        ws.close();
        console.log('--- TEST PASSED ---');

    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error.message);
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
    }
}

runTest();
