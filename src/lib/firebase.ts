
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfigDefinition = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to initialize Firebase App and ensure it's a singleton.
function initializeFirebaseAppSingleton(): FirebaseApp {
  console.log("Attempting to initialize Firebase...");

  const firebaseConfig: Record<string, string | undefined> = {};
  const missingKeys: string[] = [];
  let allConfigPresent = true;

  // Log status of each environment variable
  console.log("Checking Firebase environment variables:");
  for (const key in firebaseConfigDefinition) {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    const value = process.env[envVarName];
    if (value && typeof value === 'string' && value.trim() !== '') {
      firebaseConfig[key] = value;
      console.log(`- ${envVarName}: FOUND`);
    } else {
      firebaseConfig[key] = undefined; // Ensure it's explicitly undefined if missing/empty
      console.error(`- ${envVarName}: MISSING or EMPTY`);
      missingKeys.push(key);
      allConfigPresent = false;
    }
  }
  // Re-assign the typed config for type safety later, even if values are undefined
  const typedConfig = firebaseConfigDefinition; 

  if (!allConfigPresent) {
    console.error(
      "CRITICAL: Firebase configuration is missing or incomplete. " +
      `Missing or empty env variables for: ${missingKeys.join(', ')}. ` +
      "Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set in your .env file " +
      "and that you have RESTARTED your development server."
    );
    // Log the actual config object being used (with undefined for missing values)
    console.log("Firebase config object at time of error:", typedConfig);
    throw new Error(
      `Firebase configuration is critically missing for: ${missingKeys.join(', ')}. ` +
      "Cannot initialize Firebase. Please check your browser console for details on which environment variables are missing, " +
      "verify your .env file, and ensure you have RESTARTED your development server."
    );
  }

  if (getApps().length === 0) {
    try {
      console.log("Initializing new Firebase app with config:", typedConfig);
      return initializeApp(typedConfig as any); // Cast as any because we've validated
    } catch (e) {
      console.error("Firebase app initialization failed during initializeApp():", e);
      console.error("Config used for initialization that failed:", typedConfig);
      throw new Error(`Firebase app initialization failed: ${(e as Error).message}. Ensure Firebase config in .env is correct (e.g., API key is valid) and you've restarted the server.`);
    }
  } else {
    console.log("Returning existing Firebase app.");
    return getApp(); // Return the already initialized default app
  }
}

const app: FirebaseApp = initializeFirebaseAppSingleton();
let auth: Auth;

try {
  auth = getAuth(app);
} catch (e) {
   console.error("Firebase getAuth(app) failed. This indicates an issue with the app instance, possibly due to prior initialization failure. Error:", e);
  throw new Error(`Failed to initialize Firebase Auth from the app instance: ${(e as Error).message}.`);
}

export { app, auth };
