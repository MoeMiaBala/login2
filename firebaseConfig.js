import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration from the Firebase console
const { firebaseApiKey, firebaseAuthDomain, firebaseProjectId, firebaseStorageBucket, firebaseMessagingSenderId, firebaseAppId } = Constants.expoConfig.extra;
//console.log('Firebase Config:', Constants.expoConfig);
const firebaseConfig = {
    apiKey: firebaseApiKey || process.env.FIREBASE_API_KEY,
    authDomain: firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
    storageBucket: firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: firebaseAppId || process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
