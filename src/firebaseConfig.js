// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for Vidya Verse
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCkiyoVE4FqiVg9OdDYBNyQZd4bdiW1Mkg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "vidya-verse-2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "vidya-verse-2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "vidya-verse-2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "725150462453",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:725150462453:web:ec465211b28833e796b0bc",
};

// Validate required env vars
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  const message = `Missing Firebase environment variables: ${missingKeys.join(", ")}. Please check your .env.local file.`;
  console.error(message);
  // Don't throw error, just log it and use fallback
  console.warn('Using fallback Firebase configuration...');
} else {
  console.log('🔥 Firebase configuration loaded successfully!');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
