// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaFzXGq41GApsGX-zG95JmHtTw56rJ_xI",
  authDomain: "sih-hack-a6a50.firebaseapp.com",
  projectId: "sih-hack-a6a50",
  storageBucket: "sih-hack-a6a50.appspot.com",
  messagingSenderId: "559825209455",
  appId: "1:559825209455:web:6b83d621da3d90a036e59a"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);