const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { Firestore } = require("firebase-admin/firestore");
const express = require("express");
const app = express();
const multer = require('multer');
const FormData = require('form-data');
const upload = multer({ storage: multer.memoryStorage() });


//Cấp quyền dùng db
const { db } = require("./configs/FirebaseConfigs");



//parse json
app.use(express.json())




app.post('/chats', async (req, res) => {
    try {
        const { userId1, userId2 } = req.body; //về sau api mình truyền id vào

        if (!userId1 || !userId2) {
            return res.status(400).send({ error: 'Thiếu userId1 hoặc userId2' });
        }

        //Để đảm bảo chuỗi id luôn là 1 chuỗi cố định
        const chatId = [userId1, userId2].sort().join('_');
        //tìm chats có chatId 
        const chatRef = db.collection('chats').doc(chatId);
        //Chờ lấy lên
        const chatDoc = await chatRef.get();
        // nếu không trùng thì tạo chat mới
        if (!chatDoc.exists) {
            //Chờ gán vào
            await chatRef.set({
                participants: {
                    [userId1]: true,
                    [userId2]: true,
                },
                createdAt: Firestore.FieldValue.serverTimestamp()

            });
            const docRef = await chatRef.collection('messages').add({});
            return res.status(201).send({
                chatId: docRef.id,
                ...docRef.data()
            });
        } else {
            return res.status(200).send({ chatId, message: 'Cuộc trò chuyện đã tồn tại' });
        }
    } catch (error) {
        console.error('Lỗi khi tạo cuộc trò chuyện:', error);
        return res.status(500).send({ error: 'Không thể tạo cuộc trò chuyện' });
    }

});

// API endpoint để lấy tất cả tin nhắn trong một cuộc trò chuyện (có thể phân trang)
app.get('/chats/:chatId/messages', async (req, res) => {
    try {
        //Truyền vào header
        const userId = req.headers['userid'];


        const { chatId } = req.params;
        //chats/abc123/messages?limit=20&orderBy=timestamp&orderDirection=desc&startAfter=msg456
        //startAfter=msg456 phân trang firebase
        const { limit = 50, orderBy = 'timestamp', orderDirection = 'asc', startAfter } = req.query;


        if (!userId) {
            return res.status(400).send({ error: "Thiếu userId" })
        }
        //permission
        const chatRef = db.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get()
        if (!chatDoc.exists) {
            return res.status(404).send({ error: "Phòng chat không tồn tại" })
        }
        const participants = chatDoc.data().participants || {};
        if (!participants[userId]) {
            return res.status(403).send({ error: 'Bạn không thuộc đoạn chat này' })
        }

        const messagesRef = db.collection('chats').doc(chatId).collection('messages');
        let query = messagesRef.orderBy(orderBy, orderDirection).limit(parseInt(limit));

        if (startAfter) {
            const lastDoc = await db.collection('chats').doc(chatId).collection('messages').doc(startAfter).get();
            if (!lastDoc.exists) {
                return res.status(400).send({ error: 'ID tài liệu startAfter không hợp lệ' });
            }
            query = query.startAfter(lastDoc);
        }

        //lấy theo querry nếu có
        const snapshot = await query.get();
        //lấy data
        const messages = snapshot.docs.map(doc => ({
            messageId: doc.id,
            ...doc.data()
        }));

        return res.status(200).send(messages);
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
        return res.status(500).send({ error: 'Không thể lấy tin nhắn' });
    }
});


//Không dùng 
// API endpoint để lấy những người tham gia của một cuộc trò chuyện
app.get('/chats/:chatId/participants', async (req, res) => {
    try {
        const { chatId } = req.params;
        const chatRef = db.collection('chats').doc(chatId);
        const chatDoc = await chatRef.get();

        if (!chatDoc.exists) {
            return res.status(404).send({ error: 'Không tìm thấy cuộc trò chuyện' });
        }

        return res.status(200).send(chatDoc.data().participants || {});
    } catch (error) {
        console.error('Lỗi khi lấy người tham gia:', error);
        return res.status(500).send({ error: 'Không thể lấy người tham gia' });
    }
});

//để có permisstion những người trong phòng chat mới được nhắn
app.post('/chats/:chatId/messages', async (req, res) => {
    try {
        const { chatId } = req.params;
        //Không cần truyền senderId vào header -> check body
        const { senderId, text, imageUrl } = req.body;

        if (!senderId || (!text && !imageUrl)) {
            return res.status(400).send({ error: 'Thiếu senderId hoặc text' })
        }
        if (imageUrl && !isValidUrl(imageUrl)) {
            return res.status(400).send({ error: 'URL ảnh không hợp lệ' });
        }
        if (text && text.length > 1000) {
            return res.status(400).send({ error: 'Tin nhắn quá dài' });
        }

        //permisstion

        const chatRef = db.collection('chats').doc(chatId);
        const chatDoc = await chatRef.get();
        if (!chatDoc.exists) {
            return res.status(404).send({ error: 'Phòng chat không tồn tại' })
        }
        const participants = chatDoc.data().participants || {};
        if (!participants[senderId]) {
            return res.status(403).send({ error: 'Bạn không thuộc đoạn chat này' })
        }
        const messagesRef = db.collection('chats').doc(chatId).collection('messages')
        const newMessage = {
            senderId: senderId,
            text: text,
            //time hiện tại
            timestamp: Firestore.FieldValue.serverTimestamp(),
            //đôi khi gửi ảnh hoặc không -> không thì undifined
            ...(imageUrl && { imageUrl: imageUrl }),
        };
        const docRef = await messagesRef.add(newMessage);
        const createdDoc = await docRef.get();
        return res.status(201).send({
            messageId: docRef.id,
            ...createdDoc.data()
        });

    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn', error)
        return res.status(500).send({ error: 'Không thể gửi tin nhắn !!!' })
    }
})

//Upload ảnh lên cloudinary

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send({ error: 'Chưa có file ảnh' });

        const cloudinaryPreset = 'healthapp';
        const cloudName = 'dxiawzgnz';

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        formData.append('upload_preset', cloudinaryPreset);

        const cloudRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            { headers: formData.getHeaders() }
        );

        return res.status(200).send({ imageUrl: cloudRes.data.secure_url });
    } catch (err) {
        console.error('Lỗi khi upload ảnh:', err.message);
        return res.status(500).send({ error: 'Không thể upload ảnh' });
    }
});

exports.app = onRequest(app);