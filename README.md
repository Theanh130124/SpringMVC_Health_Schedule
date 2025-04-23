# Spring_Health_Schedule
Bài tập lớn PTHTWEB

<h2>Yêu cầu như sau</h2>

<h2>Features</h2>

<ul>1. Authenticate & Authorize</ul>
<li>Authenticated via JWT token</li>
<li>Role-based authorize: ADMIN, DOCTOR, PATIENT</li>

<ul>2. Google Authenicate & Real-time chat</ul>
<li>New user can sign in via Google Account</li>
<li>Create/Find conversations with other users (sending images is supported)</li>

<ul>3. Post management</ul>
<li>Flow: LANDLORD uploads post --> ADMIN checks --> Activated posts are visible to all users </li>
<li>Users can report posts if they find them unreliable (Spam, Fake news, Wrong coordinates, etc.). Once ADMIN notices a high report count, they can remove the post (make it invisible)</li>


# ChatRealTime_HealthSchedule
Một chức năng chat real time cho SpringMVC HealthSchedule

npm install -g firebase-tools

firebase init functions

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

![alt text](image.png)


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