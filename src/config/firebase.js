// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnAtyITYweWTvfv1aViqHSb1bm5VtBTnA",
  authDomain: "overclock-gaming-cafe-manager.firebaseapp.com",
  projectId: "overclock-gaming-cafe-manager",
  storageBucket: "overclock-gaming-cafe-manager.firebasestorage.app",
  messagingSenderId: "80476725961",
  appId: "1:80476725961:web:1ea8ac58e1b3cfe10de318",
  measurementId: "G-0ECZHB30EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);