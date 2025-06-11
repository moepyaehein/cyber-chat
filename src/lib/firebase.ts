
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeFirebaseAppSingleton(): FirebaseApp {
  const configValues = Object.values(firebaseConfig);
  const allConfigPresent = configValues.every(value => value && typeof value === 'string' && value.trim() !== '');

  if (!allConfigPresent) {
    const missingKeys = Object.entries(firebaseConfig)
      .filter(([, value]) => !value || typeof value !== 'string' || value.trim() === '')
      .map(([key]) => key);
    console.error(
      "CRITICAL: Firebase configuration is missing or incomplete. " +
      `Missing or empty env variables for: ${missingKeys.join(', ')}. ` +
      "Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set in your .env file " +
      "and that you have RESTARTED your development server."
    );
    throw new Error("Firebase configuration is critically missing. Cannot initialize Firebase. Please check server console and .env file.");
  }

  if (getApps().length === 0) {
    try {
      // console.log("Initializing new Firebase app with config:", firebaseConfig); // For debugging
      return initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Firebase app initialization failed during initializeApp():", e);
      throw new Error(`Firebase app initialization failed: ${(e as Error).message}. Ensure Firebase config in .env is correct (e.g., API key is valid) and you've restarted the server.`);
    }
  } else {
    // console.log("Returning existing Firebase app."); // For debugging
    return getApp(); // Return the already initialized default app
  }
}

const app: FirebaseApp = initializeFirebaseAppSingleton();
let auth: Auth;

try {
  auth = getAuth(app);
} catch (e) {
   console.error("Firebase getAuth(app) failed. This indicates an issue with the app instance. Error:", e);
  // This error is symptomatic of 'app' not being a valid FirebaseApp instance.
  throw new Error(`Failed to initialize Firebase Auth from the app instance: ${(e as Error).message}.`);
}

export { app, auth };
