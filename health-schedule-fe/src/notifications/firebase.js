//Phần này cho phần cloud messaging


import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDPLqQJ5zYHHcB0gKRPI_BCuhDQ7pSn6bo",
    authDomain: "healthapp-a5a6d.firebaseapp.com",
    projectId: "healthapp-a5a6d",
    storageBucket: "healthapp-a5a6d.firebasestorage.app",
    messagingSenderId: "103302228290",
    appId: "1:103302228290:web:2da602462140612a6c00db",
    measurementId: "G-DJTKFWQHYV"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);

    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BLlvwyutCIsF1y3dAHGWtiHmj1c_-CEHUkgCombQR4Jk2bltBa_gounfvQV3tGF8N5UTE71bnYp30J8ibI8sT2s",
        });
        console.log(token);
    }
}