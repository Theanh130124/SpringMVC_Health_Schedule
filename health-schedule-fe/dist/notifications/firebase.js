"use strict";
//Phần này cho phần cloud messaging
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.messaging = void 0;
const app_1 = require("firebase/app");
const messaging_1 = require("firebase/messaging");
const firebaseConfig = {
    apiKey: "AIzaSyDPLqQJ5zYHHcB0gKRPI_BCuhDQ7pSn6bo",
    authDomain: "healthapp-a5a6d.firebaseapp.com",
    projectId: "healthapp-a5a6d",
    storageBucket: "healthapp-a5a6d.firebasestorage.app",
    messagingSenderId: "103302228290",
    appId: "1:103302228290:web:2da602462140612a6c00db",
    measurementId: "G-DJTKFWQHYV"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.messaging = (0, messaging_1.getMessaging)(app);
const generateToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield Notification.requestPermission();
    console.log(permission);
    if (permission === "granted") {
        const token = yield (0, messaging_1.getToken)(exports.messaging, {
            vapidKey: "BLlvwyutCIsF1y3dAHGWtiHmj1c_-CEHUkgCombQR4Jk2bltBa_gounfvQV3tGF8N5UTE71bnYp30J8ibI8sT2s",
        });
        console.log(token);
    }
});
exports.generateToken = generateToken;
