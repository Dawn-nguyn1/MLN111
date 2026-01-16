// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB53SbMPAz5CB_zYNfxpTNjFgJaBQetkhU",
  authDomain: "mln111-84604.firebaseapp.com",
  projectId: "mln111-84604",
  storageBucket: "mln111-84604.firebasestorage.app",
  messagingSenderId: "65039540628",
  appId: "1:65039540628:web:7dc099160f8f334b83ef81",
  measurementId: "G-XGNRPK8M19"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore (Cloud Database)
export const db = getFirestore(app);
