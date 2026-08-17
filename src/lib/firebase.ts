import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAShhJo0AMIlE7QwypVFI8JmSff5r8fw9M",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "tarang-5bace.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "tarang-5bace",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "tarang-5bace.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "511463794977",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:511463794977:web:eee297fe0fe61907823660",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-LMVXN05X60",
    databaseURL:
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
        "https://tarang-5bace-default-rtdb.firebaseio.com",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

const analyticsPromise =
    typeof window !== "undefined"
        ? isSupported().then((supported) => (supported ? getAnalytics(app) : null))
        : Promise.resolve(null);

export { app, auth, db, rtdb, storage, analyticsPromise };
