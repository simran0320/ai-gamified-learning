// src/lib/firebase.js

// Initialize Firebase client SDK for Auth + Firestore
import { initializeApp } from "firebase/app";           // core initializer
import { getAuth } from "firebase/auth";                // auth (login/logout)
import { getFirestore, serverTimestamp } from "firebase/firestore"; // db + server time

const firebaseConfig = {
  apiKey: "AIzaSyC6U4cCNWofgBZSMmu9UTTvHfG5k7SMc2E",
  authDomain: "ai-gamified-learning.firebaseapp.com",
  projectId: "ai-gamified-learning",
  storageBucket: "ai-gamified-learning.firebasestorage.app",
  messagingSenderId: "775299356666",
  appId: "1:775299356666:web:73d1771f82362cbbd3b643",
  measurementId: "G-8L8S0MZ4BL"
};
// Create the app instance (must be done before using auth/db)
const app = initializeApp(firebaseConfig);

// Export Auth + Firestore handles for use across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
// Export server timestamp helper so all events use backend time
export const ts = serverTimestamp;
