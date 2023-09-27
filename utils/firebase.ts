// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);