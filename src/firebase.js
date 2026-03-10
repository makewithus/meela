import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase keys are provided and not placeholders
const isConfigValid =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app;
let db = null;
let auth = null;
let analytics = null;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Initialize Analytics only if supported in the current environment
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("📊 Firebase Analytics initialized");
      }
    });

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
  }
} else {
  console.warn(
    "⚠️ Firebase configuration is missing or invalid. \n" +
    "Please check your .env file and ensure it contains your VITE_FIREBASE_* keys. \n" +
    "The website will run in offline mode for now."
  );
}

export { db, auth, analytics };
