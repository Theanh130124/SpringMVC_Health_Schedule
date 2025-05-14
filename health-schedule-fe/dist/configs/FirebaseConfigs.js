"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
// Lấy instance của Firestore
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
