
# NAVBAT Project Status & Context
**Date:** 2026-02-08 (Updated)
**Current Phase:** Backend Integration & Code Cleanup Complete

## 📌 Project Overview
"my Navbat" is a queue management system with React/Vite.
We have successfully completed backend integration infrastructure and code cleanup.

## 💬 Latest Conversation Context
Backend Integration phase completed. Codebase cleaned.

### Achievements so far:
1.  **Architecture:** Moved complex state management out of views into custom hooks (`useSoloState`, `useClientState`, `useClientSearch`, `useClientRegistration`, `useClientScheduling`).
2.  **Persistence:** All dashboard states (serving ticket, timers, favorites, recent) now persist in `localStorage`.
3.  **Client UX:** Interactive document checklist for services.
4.  **Solo UX:** Consolidated and improved SoloDashboard component.
5.  **TypeScript Strictness:** Replaced all `any` types in hooks with strict interfaces (`SoloState`, etc.).
6.  **Dark Mode Polish:** Fixed dark mode inconsistencies in `MapComponent`, `ClientModals`, and `SoloModals`.
7.  **Backend Integration:**
    - ✅ Created centralized config service (`services/config.ts`) with environment-aware settings
    - ✅ Created HTTP client wrapper (`services/httpClient.ts`) with auth, retry, and error handling
    - ✅ Created auth service (`services/authService.ts`) with OTP login and JWT management
    - ✅ Refactored API layer (`services/api.ts`) with mock/real toggle
    - ✅ Added expanded queue operations (callNext, markServed, skipCustomer)
    - ✅ Added employee and services API endpoints
    - ✅ Created Express.js development server (`backend/server.js`)
8.  **Real-time Updates (WebSocket) - COMPLETED:**
    - ✅ Implemented robust `webSocketService` with auto-reconnect and JWT auth
    - ✅ Created `useWebSocket` and `useQueueSubscription` hooks
    - ✅ Added `ConnectionStatus` UI component to visualize connection state
    - ✅ Integrated real-time notifications for queue calls (`QUEUE_CALLED`)
    - ✅ Updated backend server to support WebSocket rooms and broadcasting
9.  **Code Cleanup - COMPLETED:**
    - ✅ Removed unused files (`admin_api.py`, `implementation_plan.md`, `backend_architecture.md`)
    - ✅ Fixed `useClientScheduling` to use API instead of direct localStorage
    - ✅ Updated `EmployeeView` to use real-time `useQueueSubscription`
    - ✅ Removed unused imports across components
    - ✅ TypeScript build passes with 0 errors

## 🏗 New Architecture Overview

### Services Layer
```
services/
├── config.ts          # Environment config, feature flags, storage keys
├── httpClient.ts      # HTTP wrapper with auth tokens, retry, error handling
├── authService.ts     # OTP login, JWT management, session persistence
├── api.ts             # Unified API layer (mock/real toggle)
├── LocalStorageDB.ts  # Mock database (legacy, still works)
└── webSocketService.ts # Real-time updates (mock/real toggle)
```

### How to Switch to Real Backend (Using Dev Server)
1. Set `VITE_USE_MOCK_API=false` in `.env.local` (Done)
2. Run `npm run dev:all` to start both frontend and backend
3. The app now uses the local Express server for API and WebSocket

### 🚧 Works in Progress (Next Steps):
1.  ~~**Database Integration:** Replace in-memory storage with PostgreSQL/MongoDB~~ ✅ **DONE** (SQLite)
2.  ~~**Telegram Bot:** Implement webhook integration for Telegram notifications~~ ✅ **DONE**
3.  **Production Backend:** Deploy to cloud (Railway, Render, or VPS)
4.  **Admin Dashboard:** Connect to real `/api/v1/stats` endpoint

## 🛠 How to Resume

### Development Mode (Mock API)
```bash
npm install
# Set VITE_USE_MOCK_API=true in .env.local
npm run dev
```

### Development with Backend Server
```bash
npm install
npm run dev:all    # Runs both frontend and backend
```

### Test Real API Calls
1. Set `VITE_USE_MOCK_API=false` in `.env.local`
2. Run `npm run dev:all`
3. Default OTP: 12345

## 📦 New Dependencies Added
- `express` - Development server framework
- `cors` - Cross-origin resource sharing
- `uuid` - Unique ID generation
- `concurrently` - Run multiple npm scripts

## 🔑 Environment Variables
```env
# API Configuration
VITE_USE_MOCK_API=true          # Use mock localStorage API
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:3001/ws

# Feature Flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_TELEGRAM=false
VITE_ENABLE_SMS=false
VITE_ENABLE_VOICE=true
```
