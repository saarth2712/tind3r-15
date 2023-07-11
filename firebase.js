import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, fieldValue } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDsaoJNe0tsifIcvXgm_TIKXObupo8ndKc",
    authDomain: "aire-26c18.firebaseapp.com",
    projectId: "aire-26c18",
    storageBucket: "aire-26c18.appspot.com",
    messagingSenderId: "171285043318",
    appId: "1:171285043318:web:c0909e3afac978f71fa757",
    measurementId: "G-BESBCSEJ2J"
};
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, fieldValue };
export default app;
