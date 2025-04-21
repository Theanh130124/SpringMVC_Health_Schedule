const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { Firestore } = require("firebase-admin/firestore");
const express = require("express");
const app = express();

//Cấp quyền dùng db
const { db  } = require("./configs/Configs");



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
                
            });
            const docRef = await chatRef.get()
            return res.status(201).send({ chatId : docRef.id ,
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

     
        if(!userId){
            return res.status(400).send({error : "Thiếu userId"})
        }
        //permission
        const chatRef = db.collection("chats").doc(chatId);
        const chatDoc = await chatRef.get()
        if(!chatDoc.exists){
            return res.status(404).send({error:"Phòng chat không tồn tại"})
        }
        const participants = chatDoc.data().participants || {};
        if(!participants[userId]){
            return res.status(403).send({error:'Bạn không thuộc đoạn chat này'})
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
app.post('/chats/:chatId/messages' , async (req ,res) => {
    try{
        const {chatId} = req.params;
        //Không cần truyền senderId vào header -> check body
        const {senderId , text , imageUrl} = req.body;

        if (!senderId || !text){
            return res.status(400).send({error :'Thiếu senderId hoặc text'})
        }

//permisstion

        const chatRef = db.collection('chats').doc(chatId);
        const chatDoc = await chatRef.get();
        if(!chatDoc.exists){
            return res.status(404).send({error : 'Phòng chat không tồn tại'})
        }
        const participants = chatDoc.data().participants || {};
        if(!participants[senderId]){
            return res.status(403).send({error:'Bạn không thuộc đoạn chat này'})
        }
        const messagesRef = db.collection('chats').doc(chatId).collection('messages')
        const newMessage = {
            senderId : senderId,
            text : text,
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

    }catch(error){
        console.error('Lỗi khi gửi tin nhắn', error)
        return res.status(500).send({error: 'Không thể gửi tin nhắn !!!'})
    }
})

exports.app = onRequest(app);