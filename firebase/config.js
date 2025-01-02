// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, collection } from "firebase/firestore";
import { getDatabase,ref,set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyClmoZ1gPGB3c9tQAR0gvrQsaAZkov-9UU",
    authDomain: "fresh-sweeper.firebaseapp.com",
    databaseURL: "https://fresh-sweeper-default-rtdb.firebaseio.com",
    projectId: "fresh-sweeper",
    storageBucket: "fresh-sweeper.appspot.com",
    messagingSenderId: "283581670255",
    appId: "1:283581670255:web:57c798307d12b0bf94be9a",
    measurementId: "G-B774TTK72R"
};


// Check if Firebase app is already initialized
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getDatabase(firebaseApp);
// Initialize Storage
export const storage = getStorage(firebaseApp);

