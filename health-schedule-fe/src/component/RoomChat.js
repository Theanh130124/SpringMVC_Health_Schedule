import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { endpoint, fbApis } from "../configs/Apis";
import "./Styles/RoomChat.css";
import axios from "axios";
import { createPeer } from "../webrtc/callvideoConfig";
import { CLOUDINARY_PRESET, CLOUDINARY_URL } from "../configs/Apis";
import { addDoc, updateDoc, doc, getDocs, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../configs/FirebaseConfigs";
import CallVideo from "./CallVideo";
import Modal from "react-bootstrap/Modal";

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

  const [incomingCall, setIncomingCall] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [myPeerId, setMyPeerId] = useState(null);
  const [peer, setPeer] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState(null);
  // Định nghĩa userAId, userBId dựa vào user hiện tại và đối phương
  const userAId = user.userId;
  const userBId = otherUser.userId;
  const chatId = room?.chatId;




  //Tạo peerId lúc vào component luôn
  useEffect(() => {
    if (!peer) {
      const newPeer = createPeer();
      setPeer(newPeer);
      newPeer.on("open", (id) => setMyPeerId(id));
    }

  }, []);


  const handleSendMessage = async () => {
    try {


      if (!messageText && !imageFile) return;
      setLoading(true);

      let imageUrl = null;


      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        // Upload trực tiếp lên Cloudinary
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.secure_url;
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
  const handleEndCallBothSides = async () => {
    // Tìm document cuộc gọi đang active (status: "accepted" hoặc "ringing")
    const q = query(
      collection(db, "videoCalls"),
      where("roomId", "==", chatId),
      where("status", "in", ["accepted", "ringing"])
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const callDoc = snapshot.docs[0];
      await updateDoc(doc(db, "videoCalls", callDoc.id), {
        status: "ended"
      });
    }
    setShowCall(false);
  }

  useEffect(() => {
    if (!showCall) return;
    const q = query(
      collection(db, "videoCalls"),
      where("roomId", "==", chatId),
      where("status", "==", "ended")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setShowCall(false);
      }
    });
    return () => unsubscribe();
  }, [showCall, chatId]);


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


  const handleRejectCall = async () => {
    if (!incomingCall) return;
    await updateDoc(doc(db, "videoCalls", incomingCall.id), {
      status: "rejected"
    });
    setShowCallModal(false);
  };

  const handleCloseCall = () => setShowCall(false);
  //Cuon xuống cuối khi có tin nhắn mới

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Khi A bấm gọi
  const handleCallRequest = async () => {
    if (!peer || !myPeerId) return;
    await addDoc(collection(db, "videoCalls"), {
      from: userAId,
      fromName: `${user.firstName} ${user.lastName}`,
      to: userBId,
      status: "ringing",
      roomId: chatId,
      timestamp: Date.now(),
      peerIdA: myPeerId
    });
    setShowCall(true);
  };


  // Khi B lắng nghe cuộc gọi đến
  useEffect(() => {
    const q = query(
      collection(db, "videoCalls"),
      where("to", "==", userAId),
      where("status", "==", "ringing")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const callDoc = snapshot.docs[0];
        setIncomingCall({ ...callDoc.data(), id: callDoc.id });
        setShowCallModal(true);
      }
    });
    return () => unsubscribe();
  }, [userAId]);


  // Khi B bấm "Bắt máy"
  const handleAcceptCall = async () => {
    if (!peer || !myPeerId) return;
    await updateDoc(doc(db, "videoCalls", incomingCall.id), {
      status: "accepted",
      peerIdB: myPeerId
    });
    setRemotePeerId(incomingCall.peerIdA);
    setShowCall(true);
    setShowCallModal(false);
  };

  // Khi status là "accepted", A lấy peerIdB để gọi
  useEffect(() => {
    if (!showCall) return;
    // Lắng nghe document cuộc gọi
    const q = query(
      collection(db, "videoCalls"),
      where("from", "==", userAId),
      where("to", "==", userBId),
      where("status", "==", "accepted")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const callDoc = snapshot.docs[0];
        setRemotePeerId(callDoc.peerIdB); // A sẽ gọi đến peerIdB
      }
    });
    return () => unsubscribe();
  }, [showCall, userAId, userBId]);

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
            <Button onClick={handleCallRequest} className="call-btn" variant="success">
              <i className="bi bi-telephone-fill me-2"></i>
              Gọi Video
            </Button>
          </div>
        </Col>

      </Row>




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
                        className="message-image"
                        alt="Hình ảnh"
                        style={{ cursor: "pointer" }}
                        onClick={() => window.open(msg.imageUrl, "_blank")}
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
      <Row className="input-row align-items-center py-2" style={{ background: "#f8f9fa", borderRadius: 12 }}>
        <Col xs={1} className="d-flex justify-content-center">
          <label htmlFor="image-upload" style={{ cursor: "pointer", marginBottom: 0 }}>
            <i className="bi bi-image" style={{ fontSize: 24, color: "#0d6efd" }} title="Gửi hình ảnh"></i>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => setImageFile(e.target.files[0])}
          />
        </Col>
        <Col xs={9}>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Soạn tin nhắn..."
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="message-input"
              style={{ borderRadius: 20, paddingLeft: 16, paddingRight: 40 }}
              autoFocus
            />
            {imageFile && (
              <span className="ms-2" style={{ position: "relative" }}>
                <i className="bi bi-file-earmark-image" style={{ fontSize: 20, color: "#198754" }}></i>
                <span style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#dc3545",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: 12,
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                  title="Xóa ảnh"
                  onClick={() => setImageFile(null)}
                >×</span>
              </span>
            )}
          </div>
        </Col>
        <Col xs={2} className="d-flex justify-content-center">
          <Button
            onClick={handleSendMessage}
            disabled={loading || (!messageText && !imageFile)}
            className="send-btn d-flex align-items-center justify-content-center"
            style={{ borderRadius: "50%", width: 40, height: 40, fontSize: 20 }}
            variant="primary"
            title="Gửi"
          >
            <i className="bi bi-send"></i>
          </Button>
        </Col>
      </Row>

      {showCallModal && incomingCall && (
        <Modal show centered>
          <Modal.Header>
            <Modal.Title>Có cuộc gọi đến</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{incomingCall.fromName || incomingCall.from} đang gọi cho bạn...</p>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="success" onClick={handleAcceptCall}>Bắt máy</Button>
              <Button variant="secondary" onClick={handleRejectCall}>Từ chối</Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {showCall && (
        <div className="callvideo-wrapper">
          <CallVideo remotePeerId={remotePeerId} peer={peer} onEndCall={handleEndCallBothSides} />
          <div className="d-flex justify-content-end mt-2">
            <Button variant="secondary" onClick={handleEndCallBothSides}>
              Đóng Video Call
            </Button>
          </div>
        </div>
      )}

    </Container>

  );
};

export default RoomChat;
