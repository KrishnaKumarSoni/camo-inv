// Firebase configuration using service account JSON authentication
// As specified in PRD: database: Firebase Firestore using service account JSON authentication
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase web app configuration extracted from service account
// Project ID from service account: camo-inv
const firebaseConfig = {
  projectId: 'camo-inv',
  authDomain: 'camo-inv.firebaseapp.com',
  storageBucket: 'camo-inv.appspot.com',
  messagingSenderId: '108347402424869521617',
  appId: '1:108347402424869521617:web:camo-inv-web',
  // Using a demo API key for development - replace with actual web app API key
  apiKey: 'AIzaSyCamoInvDemo-ReplaceWithActualWebAPIKey'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
// PRD Schema: Collections for 'skus' and 'inventory' with specified fields
export const db = getFirestore(app);

// Initialize Firebase Authentication
// PRD: Simple email/password login with automatic redirect to main app
export const auth = getAuth(app);

// For development: You can uncomment these lines to use Firebase emulators
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

export default app;