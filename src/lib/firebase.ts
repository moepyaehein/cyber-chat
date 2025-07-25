
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// --- URGENT ACTION REQUIRED ---
// PASTE YOUR FIREBASE CONFIGURATION HERE
// This is not a best practice for production, but it is necessary to
// bypass the Vercel environment variable issues you are facing.
//
// How to find this:
// 1. Go to your Firebase project settings.
// 2. Under the "General" tab, scroll down to "Your apps".
// 3. Select the "Config" option for your web app.
// 4. Copy the entire firebaseConfig object and paste it below.

const firebaseConfig = {
  // EXAMPLE:
  // apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
  // authDomain: "your-project-id.firebaseapp.com",
  // projectId: "your-project-id",
  // storageBucket: "your-project-id.appspot.com",
  // messagingSenderId: "1234567890",
  // appId: "1:1234567890:web:XXXXXXXXXXXXXXXX"
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
    console.error("Firebase config is missing. Please update src/lib/firebase.ts");
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
}


export { app, auth, firestore };
