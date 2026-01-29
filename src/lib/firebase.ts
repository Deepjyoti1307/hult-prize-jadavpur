import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAShhJo0AMIlE7QwypVFI8JmSff5r8fw9M",
    authDomain: "tarang-5bace.firebaseapp.com",
    projectId: "tarang-5bace",
    storageBucket: "tarang-5bace.firebasestorage.app",
    messagingSenderId: "511463794977",
    appId: "1:511463794977:web:eee297fe0fe61907823660",
    measurementId: "G-LMVXN05X60",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const analyticsPromise =
    typeof window !== "undefined"
        ? isSupported().then((supported) => (supported ? getAnalytics(app) : null))
        : Promise.resolve(null);

export { app, auth, db, storage, analyticsPromise };
