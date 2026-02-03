
# NAVBAT Backend Architecture (Conceptual)

## QR Code Management & Security
(See previous sections...)

## Telegram Bot Integration
The NAVBAT Telegram Bot (`@navbat_bot`) acts as a mirror for client-side actions, ensuring accessibility for users without the web/mobile app.

### 1. Webhook Architecture
- **Endpoint**: `POST /api/v1/telegram/webhook`
- **Logic**:
  - Validates Telegram `chat_id` and maps it to a registered `phone_number`.
  - Commands: `/start`, `/queue` (shows current), `/join` (scans QR via photo or enters code), `/cancel`.

### 2. Live Synchronization
- All database state changes (e.g., `QueueItem.status` updated by staff) trigger a background job to push a notification to the Telegram user via the Bot API.
- **Fairness Alerts**: If a user is skipped, the bot explicitly states the reason (logged by the employee) to maintain trust.

## Analytics & Reporting Engine
Designed to help organizations optimize their throughput.

### 1. Data Aggregation
Daily tasks aggregate metrics into a `DailyStats` table:
- `total_served`, `total_skipped`, `avg_wait_time`, `peak_hour_start`, `peak_hour_end`.

### 2. Efficiency Metrics
- **Employee ROI**: Calculates `served_count / online_hours`.
- **Peak Load Suggestions**: The system uses a simple moving average of the last 30 days to predict "Busy Day" status and alerts admins to assign more employees to specific services.

### 3. Customer Satisfaction (Badges)
- **Mutual Rating**: Employees can flag "Great Clients" (positive badge) or "No-Shows". 
- **Privacy Policy**: Ratings are processed in batches (delay of 1 hour) so that employees cannot pinpoint which specific user gave a neutral/negative internal rating.

## Security - Rate Limiting
- **Join Limit**: Max 1 active queue per phone number across ALL organizations.
- **Spam Control**: 3-minute cooldown between joining/cancelling to prevent bot-based queue flooding.
