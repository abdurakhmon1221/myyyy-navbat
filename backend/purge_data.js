
import db from './database.js';

console.log('Starting database purge (Correct Order)...');

try {
    // 1. Delete history (Child of queues/orgs)
    const historyResult = db.prepare('DELETE FROM queue_history').run();
    console.log(`Deleted ${historyResult.changes} history items.`);

    // 2. Delete active queues (Child of orgs)
    const queueResult = db.prepare('DELETE FROM queues').run();
    console.log(`Deleted ${queueResult.changes} active queues.`);

    // 3. Delete organizations (Parent)
    const orgResult = db.prepare('DELETE FROM organizations').run();
    console.log(`Deleted ${orgResult.changes} organizations.`);

    console.log('Purge complete. Database is clean.');

} catch (error) {
    console.error('Purge failed:', error);
}
