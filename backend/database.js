/**
 * NAVBAT SQLite Database Layer
 * 
 * Persistent storage for organizations, users, queues, and sessions.
 * Uses better-sqlite3 for synchronous, fast SQLite operations.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file location
const DB_PATH = path.join(__dirname, 'navbat.db');

// Initialize database
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

console.log(`[DB] SQLite database initialized at: ${DB_PATH}`);

// ============================================================================
// SCHEMA INITIALIZATION
// ============================================================================

const initSchema = () => {
    // Organizations table
    db.exec(`
        CREATE TABLE IF NOT EXISTS organizations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT,
            phone TEXT,
            description TEXT,
            category TEXT DEFAULT 'Other',
            status TEXT DEFAULT 'OPEN',
            estimated_service_time INTEGER DEFAULT 15,
            location_lat REAL,
            location_lng REAL,
            services TEXT DEFAULT '[]',
            employees TEXT DEFAULT '[]',
            earned_badges TEXT DEFAULT '[]',
            working_hours TEXT DEFAULT '{}',
            busy_hours TEXT DEFAULT '[]',
            created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
        )
    `);

    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            phone TEXT UNIQUE NOT NULL,
            name TEXT DEFAULT 'Foydalanuvchi',
            trust_score REAL DEFAULT 36.5,
            role TEXT DEFAULT 'CLIENT',
            telegram_chat_id TEXT,
            created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
        )
    `);

    // Sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            issued_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Active queues table
    db.exec(`
        CREATE TABLE IF NOT EXISTS queues (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            user_phone TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            service_id TEXT,
            position INTEGER NOT NULL,
            number TEXT NOT NULL,
            status TEXT DEFAULT 'WAITING',
            entry_time INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            estimated_start_time INTEGER,
            appointment_time INTEGER,
            logs TEXT DEFAULT '[]',
            created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            FOREIGN KEY (organization_id) REFERENCES organizations(id)
        )
    `);

    // Queue history table (served, cancelled, skipped)
    db.exec(`
        CREATE TABLE IF NOT EXISTS queue_history (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            user_phone TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            service_id TEXT,
            position INTEGER,
            number TEXT NOT NULL,
            status TEXT NOT NULL,
            entry_time INTEGER,
            exit_time INTEGER DEFAULT (strftime('%s', 'now') * 1000),
            logs TEXT DEFAULT '[]',
            created_at INTEGER
        )
    `);

    // Create indexes for faster queries
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_queues_org ON queues(organization_id);
        CREATE INDEX IF NOT EXISTS idx_queues_status ON queues(status);
        CREATE INDEX IF NOT EXISTS idx_queues_phone ON queues(user_phone);
        CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
        CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    `);

    console.log('[DB] Schema initialized successfully');
};

// Initialize schema on load
initSchema();

// ============================================================================
// ORGANIZATION OPERATIONS
// ============================================================================

export const organizationDB = {
    getAll: () => {
        const stmt = db.prepare('SELECT * FROM organizations ORDER BY name');
        return stmt.all().map(row => ({
            id: row.id,
            name: row.name,
            address: row.address,
            phone: row.phone,
            description: row.description,
            category: row.category,
            status: row.status,
            estimatedServiceTime: row.estimated_service_time,
            location: row.location_lat ? { lat: row.location_lat, lng: row.location_lng } : undefined,
            services: JSON.parse(row.services || '[]'),
            employees: JSON.parse(row.employees || '[]'),
            earnedBadges: JSON.parse(row.earned_badges || '[]'),
            workingHours: JSON.parse(row.working_hours || '{}'),
            busyHours: JSON.parse(row.busy_hours || '[]')
        }));
    },

    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM organizations WHERE id = ?');
        const row = stmt.get(id);
        if (!row) return null;

        return {
            id: row.id,
            name: row.name,
            address: row.address,
            phone: row.phone,
            description: row.description,
            category: row.category,
            status: row.status,
            estimatedServiceTime: row.estimated_service_time,
            location: row.location_lat ? { lat: row.location_lat, lng: row.location_lng } : undefined,
            services: JSON.parse(row.services || '[]'),
            employees: JSON.parse(row.employees || '[]'),
            earnedBadges: JSON.parse(row.earned_badges || '[]'),
            workingHours: JSON.parse(row.working_hours || '{}'),
            busyHours: JSON.parse(row.busy_hours || '[]')
        };
    },

    create: (org) => {
        const stmt = db.prepare(`
            INSERT INTO organizations (id, name, address, phone, description, category, status, 
                estimated_service_time, location_lat, location_lng, services, employees, 
                earned_badges, working_hours, busy_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            org.id,
            org.name,
            org.address || '',
            org.phone || '',
            org.description || '',
            org.category || 'Other',
            org.status || 'OPEN',
            org.estimatedServiceTime || 15,
            org.location?.lat || null,
            org.location?.lng || null,
            JSON.stringify(org.services || []),
            JSON.stringify(org.employees || []),
            JSON.stringify(org.earnedBadges || []),
            JSON.stringify(org.workingHours || {}),
            JSON.stringify(org.busyHours || [])
        );

        return org;
    },

    update: (org) => {
        const stmt = db.prepare(`
            UPDATE organizations SET 
                name = ?, address = ?, phone = ?, description = ?, category = ?, status = ?,
                estimated_service_time = ?, location_lat = ?, location_lng = ?, 
                services = ?, employees = ?, earned_badges = ?, working_hours = ?, busy_hours = ?,
                updated_at = ?
            WHERE id = ?
        `);

        stmt.run(
            org.name,
            org.address || '',
            org.phone || '',
            org.description || '',
            org.category || 'Other',
            org.status || 'OPEN',
            org.estimatedServiceTime || 15,
            org.location?.lat || null,
            org.location?.lng || null,
            JSON.stringify(org.services || []),
            JSON.stringify(org.employees || []),
            JSON.stringify(org.earnedBadges || []),
            JSON.stringify(org.workingHours || {}),
            JSON.stringify(org.busyHours || []),
            Date.now(),
            org.id
        );

        return org;
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM organizations WHERE id = ?');
        return stmt.run(id).changes > 0;
    },

    count: () => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM organizations');
        return stmt.get().count;
    }
};

// ============================================================================
// USER OPERATIONS
// ============================================================================

export const userDB = {
    getByPhone: (phone) => {
        const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
        const row = stmt.get(phone);
        if (!row) return null;

        return {
            id: row.id,
            phone: row.phone,
            name: row.name,
            trustScore: row.trust_score,
            role: row.role,
            telegramChatId: row.telegram_chat_id
        };
    },

    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const row = stmt.get(id);
        if (!row) return null;

        return {
            id: row.id,
            phone: row.phone,
            name: row.name,
            trustScore: row.trust_score,
            role: row.role,
            telegramChatId: row.telegram_chat_id
        };
    },

    create: (user) => {
        const stmt = db.prepare(`
            INSERT INTO users (id, phone, name, trust_score, role, telegram_chat_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            user.id,
            user.phone,
            user.name || 'Foydalanuvchi',
            user.trustScore || 36.5,
            user.role || 'CLIENT',
            user.telegramChatId || null
        );

        return user;
    },

    update: (user) => {
        const stmt = db.prepare(`
            UPDATE users SET name = ?, trust_score = ?, role = ?, telegram_chat_id = ?, updated_at = ?
            WHERE id = ?
        `);

        stmt.run(
            user.name,
            user.trustScore,
            user.role,
            user.telegramChatId || null,
            Date.now(),
            user.id
        );

        return user;
    },

    count: () => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
        return stmt.get().count;
    }
};

// ============================================================================
// SESSION OPERATIONS
// ============================================================================

export const sessionDB = {
    create: (token, userId, expiresAt) => {
        const stmt = db.prepare(`
            INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)
        `);
        stmt.run(token, userId, expiresAt);
        return { token, userId, expiresAt };
    },

    getByToken: (token) => {
        const stmt = db.prepare(`
            SELECT s.*, u.* FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.token = ?
        `);
        const row = stmt.get(token);
        if (!row) return null;

        return {
            token: row.token,
            user: {
                id: row.user_id,
                phone: row.phone,
                name: row.name,
                trustScore: row.trust_score,
                role: row.role
            },
            expiresAt: row.expires_at,
            issuedAt: row.issued_at
        };
    },

    delete: (token) => {
        const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
        return stmt.run(token).changes > 0;
    },

    deleteExpired: () => {
        const stmt = db.prepare('DELETE FROM sessions WHERE expires_at < ?');
        return stmt.run(Date.now()).changes;
    }
};

// ============================================================================
// QUEUE OPERATIONS
// ============================================================================

export const queueDB = {
    getByOrg: (orgId, status = 'WAITING') => {
        const stmt = db.prepare(`
            SELECT * FROM queues 
            WHERE organization_id = ? AND status = ? 
            ORDER BY position ASC
        `);

        return stmt.all(orgId, status).map(row => ({
            id: row.id,
            userId: row.user_id,
            userPhone: row.user_phone,
            organizationId: row.organization_id,
            serviceId: row.service_id,
            position: row.position,
            number: row.number,
            status: row.status,
            entryTime: row.entry_time,
            estimatedStartTime: row.estimated_start_time,
            appointmentTime: row.appointment_time,
            logs: JSON.parse(row.logs || '[]')
        }));
    },

    getByPhone: (phone, status = 'WAITING') => {
        const stmt = db.prepare(`
            SELECT * FROM queues 
            WHERE user_phone = ? AND status = ?
            ORDER BY entry_time DESC
        `);

        return stmt.all(phone, status).map(row => ({
            id: row.id,
            userId: row.user_id,
            userPhone: row.user_phone,
            organizationId: row.organization_id,
            serviceId: row.service_id,
            position: row.position,
            number: row.number,
            status: row.status,
            entryTime: row.entry_time,
            estimatedStartTime: row.estimated_start_time,
            appointmentTime: row.appointment_time,
            logs: JSON.parse(row.logs || '[]')
        }));
    },

    getById: (id) => {
        const stmt = db.prepare('SELECT * FROM queues WHERE id = ?');
        const row = stmt.get(id);
        if (!row) return null;

        return {
            id: row.id,
            userId: row.user_id,
            userPhone: row.user_phone,
            organizationId: row.organization_id,
            serviceId: row.service_id,
            position: row.position,
            number: row.number,
            status: row.status,
            entryTime: row.entry_time,
            estimatedStartTime: row.estimated_start_time,
            appointmentTime: row.appointment_time,
            logs: JSON.parse(row.logs || '[]')
        };
    },

    create: (queue) => {
        const stmt = db.prepare(`
            INSERT INTO queues (id, user_id, user_phone, organization_id, service_id, 
                position, number, status, entry_time, estimated_start_time, appointment_time, logs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            queue.id,
            queue.userId || null,
            queue.userPhone,
            queue.organizationId,
            queue.serviceId || null,
            queue.position,
            queue.number,
            queue.status || 'WAITING',
            queue.entryTime || Date.now(),
            queue.estimatedStartTime || null,
            queue.appointmentTime || null,
            JSON.stringify(queue.logs || [])
        );

        return queue;
    },

    updateStatus: (id, status, log) => {
        const queue = queueDB.getById(id);
        if (!queue) return null;

        const logs = queue.logs || [];
        if (log) logs.push(log);

        const stmt = db.prepare(`
            UPDATE queues SET status = ?, logs = ? WHERE id = ?
        `);
        stmt.run(status, JSON.stringify(logs), id);

        return { ...queue, status, logs };
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM queues WHERE id = ?');
        return stmt.run(id).changes > 0;
    },

    moveToHistory: (id) => {
        const queue = queueDB.getById(id);
        if (!queue) return false;

        // Insert into history
        const insertStmt = db.prepare(`
            INSERT INTO queue_history (id, user_id, user_phone, organization_id, service_id,
                position, number, status, entry_time, logs, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertStmt.run(
            queue.id,
            queue.userId,
            queue.userPhone,
            queue.organizationId,
            queue.serviceId,
            queue.position,
            queue.number,
            queue.status,
            queue.entryTime,
            JSON.stringify(queue.logs),
            queue.entryTime // created_at = entry_time
        );

        // Delete from active
        queueDB.delete(id);

        return true;
    },

    recalculatePositions: (orgId) => {
        const queues = queueDB.getByOrg(orgId, 'WAITING');
        const stmt = db.prepare('UPDATE queues SET position = ? WHERE id = ?');

        queues.forEach((q, index) => {
            stmt.run(index + 1, q.id);
        });

        return queues.length;
    },

    getNextPosition: (orgId) => {
        const stmt = db.prepare(`
            SELECT MAX(position) as maxPos FROM queues 
            WHERE organization_id = ? AND status = 'WAITING'
        `);
        const result = stmt.get(orgId);
        return (result.maxPos || 0) + 1;
    },

    countByOrg: (orgId, status = 'WAITING') => {
        const stmt = db.prepare(`
            SELECT COUNT(*) as count FROM queues 
            WHERE organization_id = ? AND status = ?
        `);
        return stmt.get(orgId, status).count;
    },

    checkExisting: (phone, orgId) => {
        const stmt = db.prepare(`
            SELECT * FROM queues 
            WHERE user_phone = ? AND organization_id = ? AND status = 'WAITING'
        `);
        return stmt.get(phone, orgId) !== undefined;
    }
};

// ============================================================================
// SEED DATA
// ============================================================================

export const seedDatabase = () => {
    // Check if already seeded
    if (organizationDB.count() > 0) {
        console.log('[DB] Database already has data, skipping seed');
        return;
    }

    console.log('[DB] Seeding database with initial data...');

    // Seed organizations
    const orgs = [];

    orgs.forEach(org => organizationDB.create(org));

    console.log(`[DB] Seeded ${orgs.length} organizations`);
};

// Export database instance for direct queries if needed
export default db;
