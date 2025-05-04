import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { endpoint, fbApis } from "../configs/Apis";
import "./Styles/RoomChat.css";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../configs/FirebaseConfigs";

const RoomChat = () => {
  const location = useLocation();
  const { room, appointment } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const user = useContext(MyUserContext);
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const doctor = appointment?.doctorId?.user;
  const patient = appointment?.patientId?.user;
  const otherUser = user.userId === doctor.userId ? patient : doctor;

  const isDoctor = user.userId === appointment.doctorId.user.userId;
  const currentAvatar = isDoctor ? appointment.doctorId.user.avatar : appointment.patientId.user.avatar;
  const otherAvatar = isDoctor ? appointment.patientId.user.avatar : appointment.doctorId.user.avatar;

  const chatId = room?.chatId;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fbApis().get(endpoint.chatMessages(chatId), {
        headers: {
          'userid': user.userId // Gửi userId trong header
        }
      });
      setMessages(res.data.sort((a, b) => a.timestamp - b.timestamp));
    } catch (error) {
      console.error("Xảy ra lỗi khi gửi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!messageText && !imageFile) return;
      setLoading(true);

      let imageUrl = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        let res = await fbApis().post(endpoint.uploadFile, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.imageUrl;
      }
      await fbApis().post(endpoint.chatMessages(chatId), {
        senderId: user.userId,
        text: messageText,
        imageUrl: imageUrl,
        timestamp: Date.now(),
      });
      setMessageText("");
      setImageFile(null);
      fetchMessages();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ ...doc.data(), messageId: doc.id }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // Dọn dẹp khi component bị huỷ
  }, [chatId]);




  return (
    <Container fluid className="chat-container">

      <Row className="chat-box">
        <Col className="chat-container">
          {messages.map(msg => {
            const isCurrentUser = msg.senderId === user.userId;
            const sender = isCurrentUser ? user : otherUser;
            const avatarUrl = isCurrentUser ? currentAvatar : otherAvatar;

            return (
              <div key={msg.messageId} className={`chat-message ${isCurrentUser ? 'message-right' : 'message-left'}`}>
                {!isCurrentUser && (
                  <img
                    src={avatarUrl || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="message-avatar"
                  />
                )}
                <div>
                  {!isCurrentUser && (
                    <div style={{ fontWeight: "bold" }}>
                      {sender.firstName} {sender.lastName}
                    </div>
                  )}
                  <div className={`bubble ${isCurrentUser ? '' : 'bubble-left'}`}>
                    {msg.text && <p style={{ marginBottom: "5px" }}>{msg.text}</p>}
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="Hình ảnh" style={{ maxWidth: "200px", borderRadius: "10px" }} />
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <img
                    src={avatarUrl || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="message-avatar"
                    style={{ marginLeft: "10px" }}
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </Col>
      </Row>

      <Row className="input-row">
        <Col>
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            className="message-input"
          />
        </Col>
        <Col>
          <input
            type="file"
            onChange={e => setImageFile(e.target.files[0])}
            className="image-input"
          />
        </Col>
        <Col>
          <Button onClick={handleSendMessage} disabled={loading} className="send-btn">
            Gửi
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RoomChat;
