import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANZ8vjkdspMIBqhbWT6R3P2W5eisat8-Q",
  authDomain: "horizon-campus-inventory.firebaseapp.com",
  projectId: "horizon-campus-inventory",
  storageBucket: "horizon-campus-inventory.firebasestorage.app",
  messagingSenderId: "25651162622",
  appId: "1:25651162622:web:299fd61eb24fe13efd64af",
  measurementId: "G-DC6GEMJLFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
