
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
  // Using placeholder values to allow the app to run.
  // Replace these with your actual Firebase project configuration.
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};


// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (firebaseConfig.apiKey && firebaseConfig.apiKey.includes('your-project-id')) {
    console.error("Firebase config is using placeholder values. Please update src/lib/firebase.ts with your project's configuration.");
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;

} else if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
}


export { app, auth, firestore };
