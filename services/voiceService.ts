
import { Language } from '../types';

export const speakAnnouncement = (text: string, lang: Language) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Determine voice/lang
    // Most browsers don't have native Uzbek TTS, so we fallback to Russian or English for structure
    // or use a specific trick. For now, we set the lang attribute.
    switch (lang) {
        case Language.RU:
            utterance.lang = 'ru-RU';
            break;
        case Language.EN:
            utterance.lang = 'en-US';
            break;
        default:
            // For Uzbek, we might need to use Russian voice but speak phonetically or just use default
            // Ideally, we'd use an external API for high quality Uzbek TTS, but for MVP we strive for browser API.
            utterance.lang = 'tr-TR'; // Turkish often sounds closer to Uzbek than others if Uzbek isn't available
            break;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    window.speechSynthesis.cancel(); // Stop previous
    window.speechSynthesis.speak(utterance);
};

export const announceTicketCall = (ticketNumber: string, deskNumber: number, lang: Language) => {
    let text = '';
    switch (lang) {
        case Language.UZ:
            text = `Mijoz ${ticketNumber.replace('-', ' ')}, ${deskNumber}-chi darchaga.`;
            break;
        case Language.RU:
            text = `Клиент ${ticketNumber.replace('-', ' ')}, пройдите к окну номер ${deskNumber}.`;
            break;
        case Language.EN:
            text = `Ticket ${ticketNumber.replace('-', ' ')}, please go to desk ${deskNumber}.`;
            break;
    }
    speakAnnouncement(text, lang);
};

let recognitionInstance: any = null;

export const startListening = (onResult: (text: string) => void, onEnd?: () => void) => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'uz-UZ'; // Primary for Navbat

    recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
    };

    if (onEnd) recognition.onend = onEnd;

    recognition.start();
    recognitionInstance = recognition;
    return recognition;
};

export const stopListening = () => {
    if (recognitionInstance) {
        recognitionInstance.stop();
        recognitionInstance = null;
    }
};
