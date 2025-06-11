
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Define the structure of the config object we expect to build
const firebaseConfigKeys = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
};

// Function to initialize Firebase App and ensure it's a singleton.
function initializeFirebaseAppSingleton(): FirebaseApp {
  console.log("Attempting to initialize Firebase (v3)...");

  const effectiveConfig: Record<string, string> = {};
  const missingEnvVarDetails: string[] = [];
  let allVarsPresent = true;

  console.log("Checking Firebase environment variables (v3):");
  for (const key in firebaseConfigKeys) {
    const envVarName = firebaseConfigKeys[key as keyof typeof firebaseConfigKeys];
    const value = process.env[envVarName];

    console.log(`- Checking: ${envVarName} (for config key: ${key}), Raw value: '${value}', Type: ${typeof value}`);

    if (value && typeof value === 'string' && value.trim() !== '') {
      effectiveConfig[key] = value;
      console.log(`  - ${envVarName}: LOADED into config.${key}`);
    } else {
      console.error(`  - ${envVarName}: MISSING or EMPTY`);
      missingEnvVarDetails.push(envVarName);
      allVarsPresent = false;
    }
  }

  if (!allVarsPresent) {
    const errorMessage =
      "CRITICAL (v3): Firebase configuration is critically missing or incomplete. " +
      `The following environment variables were not found or are empty: ${missingEnvVarDetails.join(', ')}. ` +
      "Please ensure all NEXT_PUBLIC_FIREBASE_ environment variables are correctly set in your .env file (in the project root) " +
      "and that you have RESTARTED your development server after any changes to the .env file. " +
      "The .env file should contain lines like 'NEXT_PUBLIC_FIREBASE_API_KEY=yourActualApiKey'.";
    console.error(errorMessage);
    // Also log the config object that would have been used, showing undefined for missing values
    const currentConfigAttempt: Record<string, string | undefined> = {};
    for (const key in firebaseConfigKeys) {
      currentConfigAttempt[key] = process.env[firebaseConfigKeys[key as keyof typeof firebaseConfigKeys]];
    }
    console.log("Attempted Firebase config object (values from process.env):", currentConfigAttempt);
    throw new Error(errorMessage); // This error will be caught by Next.js and shown on the error page.
  }

  if (getApps().length === 0) {
    try {
      console.log("Initializing new Firebase app with config (v3):", effectiveConfig);
      return initializeApp(effectiveConfig);
    } catch (e) {
      console.error("Firebase app initialization failed during initializeApp() (v3):", e);
      console.error("Config used for initialization that failed (v3):", effectiveConfig);
      throw new Error(`Firebase app initialization failed: ${(e as Error).message}. Ensure Firebase config in .env is correct (e.g., API key is valid) and you've restarted the server.`);
    }
  } else {
    console.log("Returning existing Firebase app (v3).");
    return getApp(); // Return the already initialized default app
  }
}

const app: FirebaseApp = initializeFirebaseAppSingleton();
let auth: Auth;

try {
  auth = getAuth(app);
} catch (e) {
   console.error("Firebase getAuth(app) failed (v3). This indicates an issue with the app instance, possibly due to prior initialization failure. Error:", e);
  throw new Error(`Failed to initialize Firebase Auth from the app instance (v3): ${(e as Error).message}.`);
}

export { app, auth };
