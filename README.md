

<h1>TOPIC : ONLINE HEALTH CHECKUP SCHEDULING APPLICATION</h2>

<h2>📁 Topic requirements:</h2>




<ul><b>🚀Authentication and Authorization:</b></ul>

<li>Login and registration with roles: patient, doctor, and administrator.</li>

<li>Doctors must be verified by the admin with a valid medical license before operating on the system.</li>


<ul><b>🚀Health Record Management:</b></ul>

<li>Patients can create and manage personal health records (medical history, test results).</li>

<li>Doctors are allowed to view and update the information after each consultation.</li>

<ul><b>🚀Appointment Scheduling:</b></ul>

<li>Patients can search for doctors by specialty, hospital, or doctor’s name.</li>

<li>Select available time slots and book appointments; the system sends confirmation emails.</li>

<li>Allow appointment cancellations or rescheduling at least 24 hours in advance.</li>

<ul> <b>🚀Online Consultation:</b></ul>

<li>Integrate video call using WebRTC or Jitsi to support remote consultations.</li>

<li>Patients and doctors can chat online before the in-person visit.</li>

<ul><b>🚀Service Payment:</b></ul>

<li>Support online payment via VNPay, MoMo, Stripe.</li>

<li>Record invoices and send payment success notifications via email.</li>

<ul><b>🚀Rating and Feedback:</b></ul>

<li>Patients can rate doctors with stars (1-5) and leave comments.</li>

<li>Doctors can respond to feedback to improve service quality.</li>

<ul><b>🚀Statistics and Reports:</b></ul>

<li>Doctors can view the number of patients served and common diseases by month/quarter.</li>

<li>Administrators monitor system activities, number of appointments, and revenue.</li>

<ul><b>🚀Reminders and Notifications:</b></ul>

<li>The system sends appointment reminders via email and push notifications.</li>

<li>Notifications about regular health checkup programs or special offers.</li>

<ul><b>🚀Real-time Chat Integration:</b></ul>

<li>Use Firebase to enable direct chat between patients and doctors.</li>

<li>Allow image and rapid test result file sharing.</li>


<h2>📦Database Schema Diagram</h2>

![alt text](image-1.png)


<h2>💻System Architecture</h2>

![alt text](image-3.png)



<h2>🛠️ Settings and Run </h2>


``` 
npm start

cd function -> npm run serve

```

```
npm install -g firebase-tools

npm install express cors //(setting express.js)

firebase init functions
```

Run powershell
![alt text](image-2.png)

firebase login :


-Select use .... then select the project created on firebase



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

```
(real time chat database structure)
![image](https://github.com/user-attachments/assets/0b4e8af3-adb1-4e25-934a-c2a035e32a11)


![image](https://github.com/user-attachments/assets/ecf7de24-8de1-41fd-bbb7-8cc2a885ccac)


-Download json :

```text
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

```


This part is FCM - Push notifications 


```
npx create-react-app push_notifications (hoặc có dự án rồi khỏi add này) 

npm install firebase 

-> Vào healthapp 

```




Docs firebase messaging :

https://firebase.google.com/docs/cloud-messaging/js/client?_gl=1*vxzd88*_up*MQ..&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGwUn9E4QYSXOvJ_EcaO-3DWACDU15atnoBbZeFZwiD3Bt-DnccGEs0aAlF9EALw_wcB&gclsrc=aw.ds&gbraid=0AAAAADpUDOj3EwOgVkhgcSZ3s2mZW3jlh


```
 - Take key pair
 - If you turn off allow then it is defined
 - Get this token after configuring the token
 - Turn on notifications for web allow 
 - Create on public in fe  
 - firebase-messaging-sw settings : import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";



```
```
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


Key 

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


Create 



Select SendTestMessgae try add token 






Css notifications :
```
npm install react-hot-toast
```






Here are demo account:

```text

Admin : tta1301 - 123456
Doctor: doc_tuyet - 123456
Patient: daobach - 123456

```

<h2>Admin UI</h2>
Login Admin:

![alt text](image-4.png)

Stats Admin : 

![alt text](image-5.png)


Approve application:

![alt text](image-6.png)

Create account doctor:

![alt text](image-7.png)


Stats doctor :

![alt text](image-8.png)

<h2>anonymous users UI</h2>

Home :

![alt text](image-9.png)


Register:

![alt text](image-10.png)

Finddoctor:

![alt text](image-11.png)


![alt text](image-12.png)

![alt text](image-13.png)

<h2>Doctor UI</h2>


<h2>User UI</h2>


-- DOCKER


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

NOTE: <h2>Lưu ý Tomcat11 nữa chỉ giải nén rồi qua server gọi thôi (không có run)</h2>