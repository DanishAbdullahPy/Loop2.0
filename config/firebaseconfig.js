import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "loop2-5db49.firebaseapp.com",
  projectId: "loop2-5db49",
  storageBucket: "loop2-5db49.appspot.com",
  messagingSenderId: "809498016186",
  appId: "1:809498016186:web:20a52599a6ea579b1d8583",
  measurementId: "G-YX1CH59NPK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)