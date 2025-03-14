// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3cKwDuQQa51jEEsD7Sozkw0I14RJyp-o",
  authDomain: "simplempg-6c08f.firebaseapp.com",
  projectId: "simplempg-6c08f",
  storageBucket: "simplempg-6c08f.firebasestorage.app",
  messagingSenderId: "209428104937",
  appId: "1:209428104937:web:f39d3cc32c63242819d278",
  measurementId: "G-FWLG7WWCW8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export { app, db, analytics };