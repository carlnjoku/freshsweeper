// isolated-firebase-test.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
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


const app =  initializeApp(firebaseConfig)

db = getDatabase(app)
// function WriteDatabaseUser(userid, name){
//     const db = getDatabase()

//     const refrenece = ref(db, 'users/' + userid)

//     set(refrenece, {
//         username:name
//     })
//     alert("hello")
// }

// WriteDatabaseUser("afigiaaasa", "calo")