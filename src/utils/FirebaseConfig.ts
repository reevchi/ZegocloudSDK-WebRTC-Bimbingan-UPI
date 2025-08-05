// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { collection, getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMsmOPdLPwXIwMma5tcmUaZXJ5jKLciXs",
  authDomain: "upi-webrtc-zegocloudsdk.firebaseapp.com",
  projectId: "upi-webrtc-zegocloudsdk",
  storageBucket: "upi-webrtc-zegocloudsdk.firebasestorage.app",
  messagingSenderId: "992853692741",
  appId: "1:992853692741:web:2fd34e941c9d0174e02e2c",
  measurementId: "G-8CQZ1RH2TJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)
export const firebaseDB = getFirestore(app)

export const usersRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");