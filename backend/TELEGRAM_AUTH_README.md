# Telegram Login Jarayoni (Backend Yo'riqnomasi)

Siz yuborgan kod asosida backendda quyidagi **OTP (Bir martalik parol)** tizimi yaratildi.

## 1. Tizim qanday ishlaydi?

### A. User Identifikatsiyasi (`chatId`)
Tizim foydalanuvchini **Telegram ID** (Chat ID) orqali taniydi.
> **Muhim:** Bu ishlashi uchun `.env` faylda `VITE_USE_MOCK_API=false` bo'lishi shart (chunki bu logika faqat real backendda mavjud).
> **Muhim:** Foydalanuvchi bazada mavjud bo'lishi va uning `telegramId` si `User` jadvalida saqlangan bo'lishi kerak.

### B. Kod Yuborish (Request)
**Endpoint:** `POST /api/v1/auth/request-telegram-otp`
**Body:** `{ "chatId": "12345678" }` (Userning Telegram IDsi)

1.  Client (App) backendga `chatId` yuboradi.
2.  Backend bazadan shu ID lik userni qidiradi.
3.  Topilsa, 5 xonali tasodifiy kod (Masalan: `48291`) yaratadi.
4.  **Telegram Bot** orqali foydalanuvchiga xabar yuboradi:
    > "Antigravity: Sizning tasdiqlash kodingiz: *48291*"

### C. Kodni Tasdiqlash (Verify)
**Endpoint:** `POST /api/v1/auth/verify-telegram-otp`
**Body:** `{ "chatId": "12345678", "otp": "48291" }`

1.  Foydalanuvchi Telegramdan olgan kodni Ilovaga kiritadi.
2.  Backend kodni tekshiradi.
3.  To'g'ri bo'lsa, **JWT Token** qaytaradi (Login muvaffaqiyatli bo'ladi).

---

## 2. Frontend (`AuthSteps.tsx`)dagi holat

Hozirgi Frontenddagi "Telegram" tugmasi (`BusinessAuthMethodStep`) faqat **Botga havola** (`t.me/navbat_uzbot?start=login`) bermoqda. Bu backenddagi yangi API bilan bog'lanmagan.

### Tavsiya etiladigan o'zgarishlar:

Backend logikasi tayyor. Uni to'liq ishga tushirish uchun Frontendda quyidagilarni qilish kerak:

1.  **Telefon raqam orqali ishlash:**
    Foydalanuvchi `Chat ID`sini yoddan bilmaydi. Shuning uchun:
    *   Foydalanuvchi **Telefon raqamini** kiritadi.
    *   Backend telefon orqali userning `telegramId` sini topadi.
    *   Agar userning Telegrami ulangan bo'lsa, kodni SMS o'rniga Telegramga yuboradi.

2.  **Yoki Login Widget:**
    Telegram Login Widget ishlatib, foydalanuvchi ID sini olgach, keyin bu API ni chaqirish mumkin.

---

## 3. Sinash uchun (Testing)

Siz hozirda Postman yoki shunga o'xshash dastur orqali API ni tekshirishingiz mumkin:

1.  **URL:** `http://localhost:3001/api/auth/request-telegram-otp`
2.  **Method:** POST
3.  **JSON Body:**
    ```json
    {
      "chatId": "SIZNING_TELEGRAM_ID_INGIZ"
    }
    ```
    *(Eslatma: Bu ID bazadagi biror userga biriktirilgan bo'lishi shart)*
