import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyATvk5qtm176rrebhodFtgpyIG1_VG97bU",
    authDomain: "task-manager-c8f37.firebaseapp.com",
    projectId: "task-manager-c8f37",
    storageBucket: "task-manager-c8f37.firebasestorage.app",
    messagingSenderId: "980132352784",
    appId: "1:980132352784:web:160471a0d6727702f90b95",
    measurementId: "G-SKJVR15ZYX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export database and auth
export const db = getFirestore(app);
export const auth = getAuth(app);