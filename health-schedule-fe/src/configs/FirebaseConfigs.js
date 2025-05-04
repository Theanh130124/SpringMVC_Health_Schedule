
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDPLqQJ5zYHHcB0gKRPI_BCuhDQ7pSn6bo",
    authDomain: "healthapp-a5a6d.firebaseapp.com",
    projectId: "healthapp-a5a6d",
    storageBucket: "healthapp-a5a6d.firebasestorage.app",
    messagingSenderId: "103302228290",
    appId: "1:103302228290:web:2da602462140612a6c00db",
    measurementId: "G-DJTKFWQHYV"
  };

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy instance của Firestore
const db = getFirestore(app);

export { db };
