# Spring_Health_Schedule
Bài tập lớn PTHTWEB


<h2>Lưu ý Tomcat11 nữa chỉ giải nén rồi qua server gọi thôi (không có run)</h2>
<h2>Yêu cầu như sau</h2>

<h2>Features</h2>

<h2>TOPIC : ONLINE HEALTH CHECKUP SCHEDULING APPLICATION</h2>

<ul>Authentication and Authorization:</ul>

<li>Login and registration with roles: patient, doctor, and administrator.</li>

<li>Doctors must be verified by the admin with a valid medical license before operating on the system.</li>

<ul>Health Record Management:</ul>

<li>Patients can create and manage personal health records (medical history, test results).</li>

<li>Doctors are allowed to view and update the information after each consultation.</li>

<ul>Appointment Scheduling:</ul>

<li>Patients can search for doctors by specialty, hospital, or doctor’s name.</li>

<li>Select available time slots and book appointments; the system sends confirmation emails.</li>

<li>Allow appointment cancellations or rescheduling at least 24 hours in advance.</li>

<ul>Online Consultation:</ul>

<li>Integrate video call using WebRTC or Jitsi to support remote consultations.</li>

<li>Patients and doctors can chat online before the in-person visit.</li>

<ul>Service Payment:</ul>

<li>Support online payment via VNPay, MoMo, Stripe.</li>

<li>Record invoices and send payment success notifications via email.</li>

<ul>Rating and Feedback:</ul>

<li>Patients can rate doctors with stars (1-5) and leave comments.</li>

<li>Doctors can respond to feedback to improve service quality.</li>

<ul>Statistics and Reports:</ul>

<li>Doctors can view the number of patients served and common diseases by month/quarter.</li>

<li>Administrators monitor system activities, number of appointments, and revenue.</li>

<ul>Reminders and Notifications:</ul>

<li>The system sends appointment reminders via email and push notifications.</li>

<li>Notifications about regular health checkup programs or special offers.</li>

<ul>Real-time Chat Integration:</ul>

<li>Use Firebase to enable direct chat between patients and doctors.</li>

<li>Allow image and rapid test result file sharing.</li>


# ChatRealTime_HealthSchedule
Một chức năng chat real time cho SpringMVC HealthSchedule

npm install -g firebase-tools

firebase init functions


Chạy powershell
![alt text](image-2.png)

firebase login 


Sau này cấu hình bên Fe nhớ mở symbollink để truy cập đc từ ngoài src

-Chọn mục use .... rồi chọn project đã tạo trên firebase

```text

  "chats": {
    "$chatId": { // ID duy nhất cho mỗi cuộc trò chuyện (ví dụ: kết hợp ID bệnh nhân và bác sĩ)
      "participants": {
        "$userId1": true, // ID của bệnh nhân
        "$userId2": true  // ID của bác sĩ
      },
      "messages": {
        "$messageId": {
          "senderId": "$userId",
          "text": "Nội dung tin nhắn",
          "imageUrl": "URL hình ảnh (nếu có)",
          "timestamp": 1678886400000 // Unix timestamp
        }
      }
    }
  },
  "users": {
    "$userId": {
      "name": "Tên người dùng",
      "role": "patient" | "doctor"
      // Các thông tin khác của người dùng
    }
  }
}
```
![image](https://github.com/user-attachments/assets/0b4e8af3-adb1-4e25-934a-c2a035e32a11)


![image](https://github.com/user-attachments/assets/ecf7de24-8de1-41fd-bbb7-8cc2a885ccac)

```text
cd function -> npm run serve

npm install express cors

```


Vao trong project setting trong firebase

bên service accounts chọn Node js

-Tải mã json về 

```text
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

```


Phần này là FCM - Push notifications 



 npx create-react-app push_notifications (hoặc có dự án rồi khỏi add này) 

 nhưng nhớ npm install firebase 

-> Vào healthapp 




Docs 

https://firebase.google.com/docs/cloud-messaging/js/client?_gl=1*vxzd88*_up*MQ..&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGwUn9E4QYSXOvJ_EcaO-3DWACDU15atnoBbZeFZwiD3Bt-DnccGEs0aAlF9EALw_wcB&gclsrc=aw.ds&gbraid=0AAAAADpUDOj3EwOgVkhgcSZ3s2mZW3jlh


lấy key pair

![alt text](image-1.png)


Có quyền nếu tắt allow đi thì nó defined

![alt text](image-2.png)

lấy token này sau khi đã cấu hình token 
![alt text](image-3.png)




Bật notifications cho web allow 



Tạo bên public 

firebase-messaging-sw

cấu hình này 

```
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);
```


thay bằng key này đã cấu hình 

```
apiKey: "AIzaSyDPLqQJ5zYHHcB0gKRPI_BCuhDQ7pSn6bo",
  authDomain: "healthapp-a5a6d.firebaseapp.com",
  projectId: "healthapp-a5a6d",
  storageBucket: "healthapp-a5a6d.firebasestorage.app",
  messagingSenderId: "103302228290",
  appId: "1:103302228290:web:2da602462140612a6c00db",
  measurementId: "G-DJTKFWQHYV"

```


thêm dòng này vào firebase-messagin-sw


```
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

```


Đi tạo  

![alt text](image-4.png)



![alt text](image-5.png)


chọn SendTestMessgae thử add token vào


![alt text](image-6.png)



Css cho thông báo
```
npm install react-hot-toast
```


System Architecture
![alt text](image.png)

Database Schema Diagram

![alt text](image-1.png)

Getting Started

Our Client website deployed at 
Admin Site: 

Here are demo account:

```text

Admin : tta1301 - 123456

```

<h2>Admin UI</h2>

<h2>Doctor UI</h2>


<h2>User UI</h2>


-- DOCKER


Cd ve docker file


Cors cho phần gửi ảnh firebase và fe
npm install cors


docker build -t springmvc-health-tomcat11 .



docker run -d -p 8080:8080 --name health_schedule_app springmvc-health-tomcat11







reactbits 
cài ts  npm install --save-dev typescript


![image](https://github.com/user-attachments/assets/80734a00-3d31-48fa-802d-e2da9cbe754f)



One-Time Installation
JS + CSS

npx jsrepo add https://reactbits.dev/default/TextAnimations/RotatingText
JS + Tailwind

npx jsrepo add https://reactbits.dev/tailwind/TextAnimations/RotatingText
TS + CSS

npx jsrepo add https://reactbits.dev/ts/default/TextAnimations/RotatingText
TS + Tailwind

npx jsrepo add https://reactbits.dev/ts/tailwind/TextAnimations/RotatingText

