// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy-PWBp13gyWDTy0ss6ZBJTQ_p4FpkWf0",
  authDomain: "mistominis.firebaseapp.com",
  projectId: "mistominis",
  storageBucket: "mistominis.firebasestorage.app",
  messagingSenderId: "778182947555",
  appId: "1:778182947555:web:21c598e2293f83fbc08bd6",
  measurementId: "G-WNJN7MZ0R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

