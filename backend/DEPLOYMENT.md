# NAVBAT Backend - Cloud Deployment Guide

## 🚀 Google Cloud Run ga Deploy qilish

### 1. Talablar
- Google Cloud hisobi
- Google Cloud SDK (gcloud CLI)
- Docker o'rnatilgan bo'lishi

### 2. Google Cloud SDK o'rnatish
Windows uchun: https://cloud.google.com/sdk/docs/install

### 3. Project yaratish va sozlash
```bash
# Login qilish
gcloud auth login

# Project yaratish (yoki mavjud project tanlash)
gcloud projects create navbat-backend-api
gcloud config set project navbat-backend-api

# Billing yoqish (Cloud Console orqali)
# https://console.cloud.google.com/billing

# Kerakli API'larni yoqish
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 4. Docker image build va push
```bash
# Backend papkaga o'tish
cd backend

# Artifact Registry repository yaratish
gcloud artifacts repositories create navbat-repo \
    --repository-format=docker \
    --location=asia-southeast1 \
    --description="Navbat backend images"

# Docker'ni sozlash
gcloud auth configure-docker asia-southeast1-docker.pkg.dev

# Image build qilish
docker build -t asia-southeast1-docker.pkg.dev/navbat-backend-api/navbat-repo/backend:latest .

# Image push qilish
docker push asia-southeast1-docker.pkg.dev/navbat-backend-api/navbat-repo/backend:latest
```

### 5. Cloud Run ga deploy
```bash
gcloud run deploy navbat-backend \
    --image=asia-southeast1-docker.pkg.dev/navbat-backend-api/navbat-repo/backend:latest \
    --platform=managed \
    --region=asia-southeast1 \
    --allow-unauthenticated \
    --port=3001 \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --set-env-vars="NODE_ENV=production,PORT=3001,TELEGRAM_BOT_TOKEN=8460856871:AAFo0djc8EdzoUwA2HoQvy_PK4P9NyX8t1U,TELEGRAM_BOT_USERNAME=navbat_uzbot"
```

### 6. Service URL olish
Deploy tugagandan so'ng URL ko'rsatiladi:
```
Service URL: https://navbat-backend-xxxxxxxxx-as.a.run.app
```

### 7. Frontend .env yangilash
```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=https://navbat-backend-xxxxxxxxx-as.a.run.app/api
VITE_WS_URL=wss://navbat-backend-xxxxxxxxx-as.a.run.app/ws
```

### 8. Frontend qayta build va deploy
```bash
cd ..  # main folder
npm run build
firebase deploy --only hosting
```

---

## 🔧 Alternativ: Railway.app (Oson deploy)

Railway.app - eng oson deploy usuli:

1. https://railway.app ga boring
2. GitHub bilan login qiling
3. "New Project" → "Deploy from GitHub repo"
4. Backend papkani tanlang
5. Environment variables qo'shing:
   - `PORT`: 3001
   - `TELEGRAM_BOT_TOKEN`: 8460856871:AAFo0djc8EdzoUwA2HoQvy_PK4P9NyX8t1U
   - `TELEGRAM_BOT_USERNAME`: navbat_uzbot
   - `ESKIZ_EMAIL`: (agar mavjud)
   - `ESKIZ_PASSWORD`: (agar mavjud)
6. "Deploy" tugmasini bosing
7. Domain olish uchun Settings → Domains → Generate Domain

---

## 🔒 Xavfsizlik eslatmalari

- Production uchun JWT_SECRET ni kuchli parol bilan almashtiring
- CORS origins ni faqat kerakli domainlar bilan cheklang
- Rate limiting yoqilganligini tekshiring
- HTTPS ishlatilayotganligini tasdiqlang

---

## 📱 Telegram Bot sozlash

Bot allaqachon yaratilgan:
- Token: `8460856871:AAFo0djc8EdzoUwA2HoQvy_PK4P9NyX8t1U`
- Username: `@navbat_uzbot`

---

## 📱 Mobile App (Android/iOS)

### 1. Talablar
- Android Studio (Android uchun)
- Xcode (iOS uchun - faqat macOS da)
- `google-services.json` (Firebase Console -> Project Settings -> Android App)
  - Bu faylni `android/app/` papkasiga joylashtiring.

### 2. Build & Run
```bash
# Web assets yangilash
npm run build
npx cap sync

# Android Studio ni ochish
npx cap open android
```

### 3. Push Notifications
- `usePushNotifications` hook orqali qurilma avtomatik ro'yxatdan o'tadi.
- Token backend ga `api.users.updateFcmToken` orqali yuboriladi.

---

## 🔥 Firebase Cloud Functions

Push bildirishnomalar ishlashi uchun:

1. `functions` papkasiga kiring: `cd functions`
2. Dependencies o'rnating: `npm install`
3. Deploy qiling: `npm run deploy`
   - Bu `queues` kolleksiyasidagi o'zgarishlarni kuzatadi (`onQueueStatusChange`).
   - Navbat chaqirilganda (`status: 'CALLED'`) foydalanuvchiga bildirishnoma yuboradi.

> **Eslatma:** Firebase Functions uchun Blaze (to'lovli) rejasi talab qilinadi.

