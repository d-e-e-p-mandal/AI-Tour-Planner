// src/service/FirebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-based-tour-planner-1862e.firebaseapp.com",
  projectId: "ai-based-tour-planner-1862e",
  storageBucket: "ai-based-tour-planner-1862e.appspot.com",
  messagingSenderId: "952285963375",
  appId: "1:952285963375:web:9d350f5bbb2b64584b199a",
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore only (NO analytics)
export const db = getFirestore(app);