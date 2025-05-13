import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { endpoint, fbApis } from "../configs/Apis";
import "./Styles/RoomChat.css";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../configs/FirebaseConfigs";
import CallVideo from "./CallVideo";

const RoomChat = () => {
  const location = useLocation();
  const { room, appointment } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const user = useContext(MyUserContext);
  const messagesEndRef = useRef(null);
  const [showCall, setShowCall] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const nav = useNavigate();
  const doctor = appointment?.doctorId?.user;
  const patient = appointment?.patientId?.user;
  const otherUser = user.userId === doctor.userId ? patient : doctor;

  const isDoctor = user.userId === appointment.doctorId.user.userId;
  const currentAvatar = isDoctor ? appointment.doctorId.user.avatar : appointment.patientId.user.avatar;
  const otherAvatar = isDoctor ? appointment.patientId.user.avatar : appointment.doctorId.user.avatar;


  const remotePeerId = otherUser?.peerId;
  const chatId = room?.chatId;



  const handleSendMessage = async () => {
    try {

      
      if (!messageText && !imageFile) return;
      setLoading(true);

      let imageUrl = null;
      

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        let res = await fbApis().post(endpoint.uploadImage, formData);
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
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);

      console.log(imageFile)
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fbApis().get(endpoint.chatMessages(chatId), {
        headers: { userid: user.userId },
      });
      setMessages(res.data.sort((a, b) => a.timestamp - b.timestamp));
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  //Xử lý snapphot để lấy tin nhắn realtime
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



  const handleStartCall = () => setShowCall(true);
  const handleCloseCall = () => setShowCall(false);
  //Cuon xuống cuối khi có tin nhắn mới

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  return (
    <Container fluid className="chat-container">
      {/* Header */}
      <Row className="chat-header">
        <Col>
          <div className="chat-header-content">
            <img
              src={otherAvatar || "https://via.placeholder.com/40"}
              alt="Avatar"
              className="header-avatar"
            />
            <h5 className="header-title">
              {otherUser?.firstName} {otherUser?.lastName}
            </h5>
          </div>
          <div className="d-flex justify-content-end">
            <Button onClick={handleStartCall} className="call-btn" variant="success">
              <i className="bi bi-telephone-fill me-2"></i>
              Gọi Video
            </Button>
          </div>
        </Col>

      </Row>
      {/* Hiển thị CallVideo nếu showCall = true */}
      {showCall && (
        <div className="callvideo-wrapper">
          <CallVideo remotePeerId={remotePeerId} />
          <div className="d-flex justify-content-end mt-2">
            <Button variant="secondary" onClick={handleCloseCall}>
              Đóng Video Call
            </Button>
          </div>
        </div>
      )}



      {/* Chat Messages */}
      <Row className="chat-box">
        <Col className="chat-messages">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === user.userId;
            const sender = isCurrentUser ? user : otherUser;
            const avatarUrl = isCurrentUser ? currentAvatar : otherAvatar;

            return (
              <div
                key={msg.messageId}
                className={`chat-message ${isCurrentUser ? "message-right" : "message-left"} ${msg.isNew ? "new-message" : ""
                  }`}
              >
                {!isCurrentUser && (
                  <img
                    src={avatarUrl || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="message-avatar"
                  />
                )}
                <div>
                  {!isCurrentUser && (
                    <div className="message-sender">
                      {sender.firstName} {sender.lastName}
                    </div>
                  )}
                  <div className={`bubble ${isCurrentUser ? "" : "bubble-left"}`}>
                    {msg.text && <p>{msg.text}</p>}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Hình ảnh"
                        className="message-image"
                      />
                    )}
                  </div>
                </div>
                {isCurrentUser && (
                  <img
                    src={avatarUrl || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="message-avatar"
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </Col>
      </Row>

      {/* Input Row */}
      <Row className="input-row">
        <Col xs={8}>
          <Form.Control
            type="text"
            placeholder="Nhập tin nhắn..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="message-input"
          />
        </Col>
        <Col xs={2}>
          <input
            type="file"
            name="image"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="image-input"
          />
        </Col>
        <Col xs={2}>
          <Button
            onClick={handleSendMessage}
            disabled={loading}
            className="send-btn"
          >
            Gửi
          </Button>
        </Col>
      </Row>


    </Container>
  );
};

export default RoomChat;
