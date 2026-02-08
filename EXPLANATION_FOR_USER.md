# Telegram Login Jarayoni (Tushuntirish)

Siz so'ragan Telegram orqali kirish jarayoni backendda to'liq shakllantirildi.

## 1. Backend Logikasi
Backendda ikkita yangi API yaratildi (`authController.ts` va `telegramBot.ts` orqali):

1.  **Kod so'rash:** `POST /api/v1/auth/request-telegram-otp`
    *   Foydalanuvchi `chatId` (Telegram ID) yuboradi.
    *   Tizim bu IDni bazadan izlaydi (`User` jadvalida `telegramId` bo'lishi shart).
    *   Agar user topilsa, 5 xonali kod yaratib, Telegram Bot orqali yuboradi ("Antigravity: Sizning kodingiz...").
    
2.  **Tasdiqlash:** `POST /api/v1/auth/verify-telegram-otp`
    *   Foydalanuvchi olgan kodini va ID sini yuboradi.
    *   Tizim kodni tekshirib, kirishga ruxsat beradi (Token qaytaradi).

## 2. Frontenddagi Holat
Hozircha frontend (`AuthSteps.tsx`)dagi Telegram tugmasi faqat botga havola bermoqda. Bu yangi API bilan bog'lanmagan. 

**Tavsiya:** Tizimni qulay qilish uchun frontendda foydalanuvchi telefon raqamini kiritganda, unga "Kod qayerga yuborilsin? (SMS / Telegram)" degan tanlov berish kerak.
*   Agar Telegram tanlansa, backend telefon orqali userning `telegramId` sini topib, kodni botga yuboradi.

## 3. Muhim O'zgarishlar
Men tizim ishlashi uchun quyidagi o'zgarishlarni qildim:
*   **API Versioning:** Backend endi `/api/v1/auth` manzillarini ishlatadi.
*   **Frontend Config:** `.env` faylida `VITE_API_BASE_URL` ni `http://localhost:3001/api/v1` ga o'zgartirdim.
*   **Mock API:** Bu tizim ishlashi uchun `.env` da `VITE_USE_MOCK_API=false` bo'lishi kerak.

Batafsil ma'lumot: `backend/TELEGRAM_AUTH_README.md` faylida.
