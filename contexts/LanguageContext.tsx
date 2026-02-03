
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

type Translations = Record<string, Record<Language, string>>;

const TRANSLATIONS: Translations = {
    // General
    'app_name': { uz: 'NAVBAT', ru: 'НАВБАТ', en: 'NAVBAT' },
    'welcome': { uz: 'Xush kelibsiz', ru: 'Добро пожаловать', en: 'Welcome' },
    'loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
    'search_placeholder': { uz: 'Muassasa qidirish...', ru: 'Поиск организации...', en: 'Search organization...' },
    'address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
    'back': { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
    'cancel': { uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' },
    'save': { uz: 'Saqlash', ru: 'Сохранить', en: 'Save' },
    'slogan': { uz: 'Odil Tizim', ru: 'Честная Система', en: 'Fair System' },

    // Auth - App Description
    'app_tagline': { uz: 'Navbat kutish - endi o\'tmishda', ru: 'Ожидание в очереди - теперь в прошлом', en: 'Queue waiting - now in the past' },
    'app_description': { uz: 'Aqlli navbat tizimi - vaqtingizni tejang, masofadan navbatga yoziling va navbatingiz kelganida xabar oling', ru: 'Умная система очередей - экономьте время, записывайтесь удаленно и получайте уведомления', en: 'Smart queue system - save time, join remotely and get notified when it\'s your turn' },

    // Auth - Entry
    'login_client': { uz: 'Mijoz', ru: 'Клиент', en: 'Client' },
    'login_client_desc': { uz: 'Navbatga yozilish va xizmatlardan foydalanish', ru: 'Записаться в очередь и пользоваться услугами', en: 'Join queues and use services' },
    'login_business': { uz: 'Tashkilot', ru: 'Организация', en: 'Organization' },
    'login_business_desc': { uz: 'Navbatni boshqarish va statistika', ru: 'Управление очередью и статистика', en: 'Queue management and analytics' },

    // Auth - Client Login Methods
    'choose_login_method': { uz: 'Kirish usulini tanlang', ru: 'Выберите способ входа', en: 'Choose login method' },
    'phone_login': { uz: 'Telefon raqami', ru: 'Номер телефона', en: 'Phone number' },
    'phone_login_desc': { uz: 'SMS orqali tasdiqlash', ru: 'Подтверждение через SMS', en: 'Verify via SMS' },
    'telegram_login': { uz: 'Telegram', ru: 'Telegram', en: 'Telegram' },
    'telegram_login_desc': { uz: 'Tezkor avtomatik kirish', ru: 'Быстрый авто-вход', en: 'Quick auto-login' },
    'google_login': { uz: 'Google', ru: 'Google', en: 'Google' },
    'google_login_desc': { uz: 'Google hisobi orqali', ru: 'Через аккаунт Google', en: 'Via Google account' },
    'guest_login': { uz: 'Mehmon sifatida', ru: 'Как гость', en: 'As guest' },
    'guest_login_desc': { uz: "Ro'yxatdan o'tmasdan ko'rish", ru: 'Просмотр без регистрации', en: 'Browse without registration' },
    'guest_continue': { uz: "Mehmon bo'lib davom etish", ru: 'Продолжить как гость', en: 'Continue as guest' },
    'qr_scanner': { uz: 'QR Skaner', ru: 'QR Сканер', en: 'QR Scanner' },

    // Auth - Business Type
    'business_corporate': { uz: 'Tashkilot sifatida', ru: 'Как организация', en: 'As organization' },
    'business_corporate_desc': { uz: 'Bank, Tibbiyot markazi, Davlat tashkiloti', ru: 'Банк, Мед. центр, Гос. организация', en: 'Bank, Medical center, Government' },
    'business_solo': { uz: 'Yakka tadbirkor', ru: 'Индивидуальный предприниматель', en: 'Solo entrepreneur' },
    'business_solo_desc': { uz: 'Sartarosh, Shaxsiy usta, Shifokor', ru: 'Парикмахер, Мастер, Врач', en: 'Barber, Craftsman, Doctor' },

    // Auth - Corp Role
    'role_org_admin': { uz: 'Tashkilot admini', ru: 'Админ организации', en: 'Organization admin' },
    'role_org_admin_desc': { uz: 'Boshqaruv, statistika va xodimlar', ru: 'Управление, статистика и сотрудники', en: 'Management, analytics and employees' },
    'role_employee': { uz: 'Tashkilot xodimi', ru: 'Сотрудник организации', en: 'Organization employee' },
    'role_employee_desc': { uz: 'Navbat qabuli va xizmat ko\'rsatish', ru: 'Прием очереди и обслуживание', en: 'Queue reception and service' },

    // Auth - OTP
    'enter_phone': { uz: 'Telefon raqamingiz', ru: 'Ваш номер телефона', en: 'Your phone number' },
    'otp_sent': { uz: 'SMS orqali kod yuboriladi', ru: 'Код будет отправлен по SMS', en: 'Code will be sent via SMS' },
    'get_code': { uz: 'Kod olish', ru: 'Получить код', en: 'Get code' },
    'verification': { uz: 'Tasdiqlash', ru: 'Подтверждение', en: 'Verification' },
    'code_sent_to': { uz: 'raqamiga yuborilgan kodni kiriting', ru: 'Введите код, отправленный на', en: 'Enter code sent to' },
    'verify': { uz: 'Tasdiqlash', ru: 'Подтвердить', en: 'Verify' },
    'test_code': { uz: 'Test kodi: 12345', ru: 'Тест код: 12345', en: 'Test code: 12345' },
    'resend_code': { uz: 'Kodni qayta yuborish', ru: 'Отправить код повторно', en: 'Resend code' },
    'or': { uz: 'yoki', ru: 'или', en: 'or' },

    // Auth - Password
    'personal_password': { uz: 'Parol', ru: 'Пароль', en: 'Password' },
    'enter_password_desc': { uz: 'Tizimga kirish uchun parolingizni kiriting', ru: 'Введите пароль для входа в систему', en: 'Enter your password to access the system' },
    'system_root': { uz: 'Tizim administratori', ru: 'Системный администратор', en: 'System administrator' },

    // Auth - Registration reminder
    'register_to_join': { uz: "Navbatga yozilish uchun ro'yxatdan o'ting", ru: 'Зарегистрируйтесь чтобы встать в очередь', en: 'Register to join the queue' },
    'already_registered': { uz: "Allaqachon ro'yxatdan o'tganmisiz?", ru: 'Уже зарегистрированы?', en: 'Already registered?' },
    'login_here': { uz: 'Kirish', ru: 'Войти', en: 'Login' },

    // Navigation - Client
    'nav_home': { uz: 'Asosiy', ru: 'Главная', en: 'Home' },
    'nav_map': { uz: 'Xarita', ru: 'Карта', en: 'Map' },
    'nav_scan': { uz: 'Scan', ru: 'Скан', en: 'Scan' },
    'nav_queues': { uz: 'Navbatlar', ru: 'Очереди', en: 'Queues' },
    'nav_profile': { uz: 'Profil', ru: 'Профиль', en: 'Profile' },

    // Navigation - Company
    'nav_dashboard': { uz: 'Boshqaruv', ru: 'Панель', en: 'Dashboard' },
    'nav_analytics': { uz: 'Tahlil', ru: 'Аналитика', en: 'Analytics' },
    'nav_employees': { uz: 'Xodimlar', ru: 'Сотрудники', en: 'Employees' },
    'nav_settings': { uz: 'Sozlamalar', ru: 'Настройки', en: 'Settings' },

    // Navigation - Employee
    'nav_work': { uz: 'Ish', ru: 'Работа', en: 'Work' },
    'nav_history': { uz: 'Tarix', ru: 'История', en: 'History' },

    // Navigation - Admin
    'nav_system': { uz: 'Tizim', ru: 'Система', en: 'System' },
    'nav_orgs': { uz: 'Muassasalar', ru: 'Организации', en: 'Organizations' },
    'nav_audit': { uz: 'Audit', ru: 'Аудит', en: 'Audit' },

    // Roles
    'client': { uz: 'Mijoz', ru: 'Клиент', en: 'Client' },
    'business': { uz: 'Biznes', ru: 'Бизнес', en: 'Business' },
    'employee': { uz: 'Xodim', ru: 'Сотрудник', en: 'Employee' },
    'admin': { uz: 'Admin', ru: 'Админ', en: 'Admin' },
    'organization': { uz: 'Tashkilot', ru: 'Организация', en: 'Organization' },

    // Queue Actions
    'join_queue': { uz: 'Navbat olish', ru: 'Встать в очередь', en: 'Join Queue' },
    'scan_qr': { uz: 'QR orqali kirish', ru: 'Вход через QR', en: 'Scan QR' },
    'get_ticket': { uz: 'Chipta olish', ru: 'Получить талон', en: 'Get Ticket' },
    'my_queues': { uz: 'Navbatlarim', ru: 'Мои очереди', en: 'My Queues' },
    'active_tickets': { uz: 'Faol chiptalar', ru: 'Активные талоны', en: 'Active tickets' },
    'no_queues': { uz: "Navbatlar yo'q", ru: 'Нет очередей', en: 'No queues' },

    // Tabs
    'tab_home': { uz: 'Asosiy', ru: 'Главная', en: 'Home' },
    'tab_map': { uz: 'Xarita', ru: 'Карта', en: 'Map' },
    'tab_queues': { uz: 'Navbatlar', ru: 'Очереди', en: 'Queues' },

    // Filters
    'filter_all': { uz: 'Barchasi', ru: 'Все', en: 'All' },
    'filter_nearby': { uz: 'Yaqinlar', ru: 'Рядом', en: 'Nearby' },
    'filter_popular': { uz: 'Ommabop', ru: 'Популярные', en: 'Popular' },
    'search_results': { uz: 'Qidiruv natijalari', ru: 'Результаты поиска', en: 'Search results' },
    'recommendations': { uz: 'Siz uchun tavsiyalar', ru: 'Рекомендации для вас', en: 'Recommendations for you' },

    // Status
    'status_active': { uz: 'Faol', ru: 'Активный', en: 'Active' },
    'status_waiting': { uz: 'Kutilmoqda', ru: 'Ожидание', en: 'Waiting' },
    'status_called': { uz: 'Chaqirildi', ru: 'Вызван', en: 'Called' },
    'status_served': { uz: 'Yakunlangan', ru: 'Обслужен', en: 'Served' },
    'status_cancelled': { uz: 'Bekor qilindi', ru: 'Отменено', en: 'Cancelled' },
    'status_skipped': { uz: "O'tkazib yuborildi", ru: 'Пропущен', en: 'Skipped' },

    // Actions
    'logout': { uz: 'Tizimdan chiqish', ru: 'Выйти из системы', en: 'Logout' },
    'im_coming': { uz: 'Kelayapman', ru: 'Иду', en: "I'm coming" },
    'skip_turn': { uz: "O'rin bo'shatish", ru: 'Уступить место', en: 'Skip turn' },
    'share': { uz: 'Ulashish', ru: 'Поделиться', en: 'Share' },
    'rate': { uz: 'Baholash', ru: 'Оценить', en: 'Rate' },
    'history': { uz: 'Tarix', ru: 'История', en: 'History' },

    // Time
    'minutes': { uz: 'daqiqa', ru: 'минут', en: 'minutes' },
    'hours': { uz: 'soat', ru: 'часов', en: 'hours' },
    'estimated_wait': { uz: 'Taxminiy kutish', ru: 'Примерное ожидание', en: 'Estimated wait' },

    // Notifications & Alerts
    'cancel_confirm': { uz: 'Navbatni bekor qilmoqchimisiz?', ru: 'Вы хотите отменить очередь?', en: 'Do you want to cancel the queue?' },
    'coming_alert': { uz: 'Muassasaga kelayotganingiz xabar qilindi.', ru: 'Организация уведомлена о вашем прибытии.', en: 'Organization notified of your arrival.' },
    'swapped_alert': { uz: "Navbatingiz bitta keyingi o'ringa surildi.", ru: 'Ваша очередь сдвинута на одну позицию назад.', en: 'Your queue has been moved one position back.' },
    'already_in_queue': { uz: 'Sizda ushbu muassasada faol navbat bor.', ru: 'У вас уже есть активная очередь в этой организации.', en: 'You already have an active queue in this organization.' },
    'offline_mode': { uz: 'Oflayn rejim', ru: 'Офлайн режим', en: 'Offline mode' },
    'data_from_cache': { uz: "Ma'lumotlar keshdan", ru: 'Данные из кэша', en: 'Data from cache' },
    'your_turn': { uz: 'Sizning navbatingiz keldi!', ru: 'Ваша очередь!', en: 'Your turn!' },
    'enter_org': { uz: 'muassasasiga kiring.', ru: 'Войдите в организацию.', en: 'Enter the organization.' },

    // Errors
    'error_phone_short': { uz: "Raqamni to'liq kiriting", ru: 'Введите полный номер', en: 'Enter complete phone number' },
    'error_wrong_code': { uz: 'Kod xato (Test: 12345)', ru: 'Неверный код (Тест: 12345)', en: 'Wrong code (Test: 12345)' },
    'error_wrong_password': { uz: "Parol noto'g'ri", ru: 'Неверный пароль', en: 'Wrong password' },
    'error_camera': { uz: 'Kamera ruxsati topilmadi.', ru: 'Доступ к камере не получен.', en: 'Camera permission denied.' },

    // Misc
    'powered_by': { uz: 'Powering next-gen service', ru: 'Сервис нового поколения', en: 'Powering next-gen service' },
    'smart_queue': { uz: 'Smart Queue Experience', ru: 'Умная система очередей', en: 'Smart Queue Experience' },
    'copied': { uz: 'Nusxa olindi!', ru: 'Скопировано!', en: 'Copied!' },
    'help_sent': { uz: "Yordam so'rovi yuborildi!", ru: 'Запрос на помощь отправлен!', en: 'Help request sent!' },

    // Badge labels
    'trust_score': { uz: "Ishonch ko'rsatkichi", ru: 'Индекс доверия', en: 'Trust Score' },

    // Profile & Settings
    'edit_profile': { uz: 'Profilni tahrirlash', ru: 'Редактировать профиль', en: 'Edit Profile' },
    'personal_info': { uz: "Shaxsiy ma'lumotlar", ru: 'Личная информация', en: 'Personal Info' },
    'app_settings': { uz: 'Ilova sozlamalari', ru: 'Настройки приложения', en: 'App Settings' },
    'security': { uz: 'Xavfsizlik', ru: 'Безопасность', en: 'Security' },
    'support_info': { uz: 'Yordam va ma\'lumot', ru: 'Помощь и информация', en: 'Support & Info' },
    'notifications': { uz: 'Bildirishnomalar', ru: 'Уведомления', en: 'Notifications' },
    'dark_mode': { uz: 'Tungi rejim', ru: 'Темная тема', en: 'Dark Mode' },
    'language': { uz: 'Til', ru: 'Язык', en: 'Language' },
    'help_center': { uz: 'Yordam markazi', ru: 'Центр помощи', en: 'Help Center' },
    'about_app': { uz: 'Ilova haqida', ru: 'О приложении', en: 'About App' },
    'privacy_policy': { uz: 'Maxfiylik siyosati', ru: 'Политика конфиденциальности', en: 'Privacy Policy' },
    'share_app': { uz: 'Do\'stlarga ulashish', ru: 'Поделиться приложением', en: 'Share App' },
    'wallet': { uz: 'Hamyon', ru: 'Кошелек', en: 'Wallet' },
    'favorites': { uz: 'Sevimlilar', ru: 'Избранное', en: 'Favorites' },
    'version': { uz: 'Versiya', ru: 'Версия', en: 'Version' },
    'on': { uz: 'Yoqilgan', ru: 'Вкл', en: 'On' },
    'off': { uz: 'O\'chirilgan', ru: 'Выкл', en: 'Off' },
    'name_placeholder': { uz: 'To\'liq ism', ru: 'Полное имя', en: 'Full Name' },
    'phone_placeholder': { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
    'address_placeholder': { uz: 'Manzil / Muassasa nomi', ru: 'Адрес / Название организации', en: 'Address / Org Name' },
};


interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: Translations;
    updateTranslation: (key: string, lang: Language, value: string) => void;
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('navbat_lang') as Language) || Language.UZ;
    });

    const [translations, setTranslations] = useState<Translations>(TRANSLATIONS);

    useEffect(() => {
        localStorage.setItem('navbat_lang', language);
    }, [language]);

    const t = (key: string): string => {
        return translations[key]?.[language] || key;
    };

    const updateTranslation = (key: string, lang: Language, value: string) => {
        setTranslations(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [lang]: value
            }
        }));
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translations, updateTranslation }}>
            {children}
        </LanguageContext.Provider>
    );
};


export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
