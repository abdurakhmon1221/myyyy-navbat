/**
 * Firebase Configuration
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "my-navbat.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "my-navbat",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "my-navbat.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;
