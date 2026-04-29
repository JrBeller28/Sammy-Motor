import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error logging in", error);
    }
};

export const logout = async () => {
    await signOut(auth);
};
