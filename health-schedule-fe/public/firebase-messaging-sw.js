// firebase-messaging-sw.js (Đặt ở thư mục public nếu dùng React hoặc Vite)

importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Khởi tạo Firebase App
firebase.initializeApp({
  apiKey: "AIzaSyDPLqQJ5zYHHcB0gKRPI_BCuhDQ7pSn6bo",
  authDomain: "healthapp-a5a6d.firebaseapp.com",
  projectId: "healthapp-a5a6d",
  storageBucket: "healthapp-a5a6d.appspot.com",
  messagingSenderId: "103302228290",
  appId: "1:103302228290:web:2da602462140612a6c00db",
  measurementId: "G-DJTKFWQHYV"
});

// Lấy instance messaging
const messaging = firebase.messaging();

// Xử lý thông báo khi ở background
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});