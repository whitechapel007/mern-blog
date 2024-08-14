// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-17343.firebaseapp.com",
  projectId: "mern-blog-17343",
  storageBucket: "mern-blog-17343.appspot.com",
  messagingSenderId: "1036684836075",
  appId: "1:1036684836075:web:7619c70a153b5b5b1412ae",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


