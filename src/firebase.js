// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8bcz1njXntCAZIgiT2srWkAij6z9dMUs",
  authDomain: "taskmanager-c10ce.firebaseapp.com",
  projectId: "taskmanager-c10ce",
  storageBucket: "taskmanager-c10ce.appspot.com",
  messagingSenderId: "71489688647",
  appId: "1:71489688647:web:e1cd9b4375163d058dcd62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };