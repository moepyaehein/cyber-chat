import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// --- URGENT ACTION REQUIRED ---
// PASTE YOUR **REAL** FIREBASE CONFIGURATION HERE.
// Using the correct configuration is critical for features like email verification
// to work properly and avoid spam folders.
//
// How to find your config:
// 1. Go to your Firebase project at console.firebase.google.com
// 2. Click the gear icon (Project settings) in the top left.
// 3. Under the "General" tab, scroll down to the "Your apps" section.
// 4. If you don't have a web app, create one.
// 5. For your web app, click on the "Config" option (or </> icon).
// 6. Copy the entire firebaseConfig object and paste it below, replacing the placeholder.

const firebaseConfig = {
  // === PASTE YOUR CONFIG OBJECT HERE ===
  // It should look like this:
  // apiKey: "AIza...",
  // authDomain: "your-project-id.firebaseapp.com",
  // projectId: "your-project-id",
  // storageBucket: "your-project-id.appspot.com",
  // messagingSenderId: "...",
  // appId: "1:..."
};


// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (firebaseConfig.apiKey && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
    // Provide dummy objects if config is missing to avoid crashes
    console.error("Firebase config is missing. Please update src/lib/firebase.ts with your project's configuration.");
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
}


export { app, auth, firestore };
