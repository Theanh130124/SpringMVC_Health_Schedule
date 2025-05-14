"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const MyContexts_1 = require("../configs/MyContexts");
const react_bootstrap_1 = require("react-bootstrap");
const Apis_1 = require("../configs/Apis");
require("./Styles/RoomChat.css");
const firestore_1 = require("firebase/firestore");
const FirebaseConfigs_1 = require("../configs/FirebaseConfigs");
const CallVideo_1 = __importDefault(require("./CallVideo"));
const RoomChat = () => {
    var _a, _b;
    const location = (0, react_router_dom_1.useLocation)();
    const { room, appointment } = location.state || {};
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(1);
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const messagesEndRef = (0, react_1.useRef)(null);
    const [showCall, setShowCall] = (0, react_1.useState)(false);
    const [messageText, setMessageText] = (0, react_1.useState)("");
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const nav = (0, react_router_dom_1.useNavigate)();
    const doctor = (_a = appointment === null || appointment === void 0 ? void 0 : appointment.doctorId) === null || _a === void 0 ? void 0 : _a.user;
    const patient = (_b = appointment === null || appointment === void 0 ? void 0 : appointment.patientId) === null || _b === void 0 ? void 0 : _b.user;
    const otherUser = user.userId === doctor.userId ? patient : doctor;
    const isDoctor = user.userId === appointment.doctorId.user.userId;
    const currentAvatar = isDoctor ? appointment.doctorId.user.avatar : appointment.patientId.user.avatar;
    const otherAvatar = isDoctor ? appointment.patientId.user.avatar : appointment.doctorId.user.avatar;
    const remotePeerId = otherUser === null || otherUser === void 0 ? void 0 : otherUser.peerId;
    const chatId = room === null || room === void 0 ? void 0 : room.chatId;
    const handleSendMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!messageText && !imageFile)
                return;
            setLoading(true);
            let imageUrl = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                let res = yield (0, Apis_1.fbApis)().post(Apis_1.endpoint.uploadImage, formData);
                imageUrl = res.data.imageUrl;
            }
            yield (0, Apis_1.fbApis)().post(Apis_1.endpoint.chatMessages(chatId), {
                senderId: user.userId,
                text: messageText,
                imageUrl: imageUrl,
                timestamp: Date.now(),
            });
            setMessageText("");
            setImageFile(null);
        }
        catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            console.log(imageFile);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        const fetchMessages = () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, Apis_1.fbApis)().get(Apis_1.endpoint.chatMessages(chatId), {
                headers: { userid: user.userId },
            });
            setMessages(res.data.sort((a, b) => a.timestamp - b.timestamp));
        });
        if (chatId) {
            fetchMessages();
        }
    }, [chatId]);
    //Xử lý snapphot để lấy tin nhắn realtime
    (0, react_1.useEffect)(() => {
        if (!chatId)
            return;
        const q = (0, firestore_1.query)((0, firestore_1.collection)(FirebaseConfigs_1.db, "chats", chatId, "messages"), (0, firestore_1.orderBy)("timestamp", "asc"));
        const unsubscribe = (0, firestore_1.onSnapshot)(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => (Object.assign(Object.assign({}, doc.data()), { messageId: doc.id })));
            setMessages(msgs);
        });
        return () => unsubscribe(); // Dọn dẹp khi component bị huỷ
    }, [chatId]);
    const handleStartCall = () => setShowCall(true);
    const handleCloseCall = () => setShowCall(false);
    //Cuon xuống cuối khi có tin nhắn mới
    (0, react_1.useEffect)(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    return (<react_bootstrap_1.Container fluid className="chat-container">
      {/* Header */}
      <react_bootstrap_1.Row className="chat-header">
        <react_bootstrap_1.Col>
          <div className="chat-header-content">
            <img src={otherAvatar || "https://via.placeholder.com/40"} alt="Avatar" className="header-avatar"/>
            <h5 className="header-title">
              {otherUser === null || otherUser === void 0 ? void 0 : otherUser.firstName} {otherUser === null || otherUser === void 0 ? void 0 : otherUser.lastName}
            </h5>
          </div>
          <div className="d-flex justify-content-end">
            <react_bootstrap_1.Button onClick={handleStartCall} className="call-btn" variant="success">
              <i className="bi bi-telephone-fill me-2"></i>
              Gọi Video
            </react_bootstrap_1.Button>
          </div>
        </react_bootstrap_1.Col>

      </react_bootstrap_1.Row>
      {/* Hiển thị CallVideo nếu showCall = true */}
      {showCall && (<div className="callvideo-wrapper">
          <CallVideo_1.default remotePeerId={remotePeerId}/>
          <div className="d-flex justify-content-end mt-2">
            <react_bootstrap_1.Button variant="secondary" onClick={handleCloseCall}>
              Đóng Video Call
            </react_bootstrap_1.Button>
          </div>
        </div>)}



      {/* Chat Messages */}
      <react_bootstrap_1.Row className="chat-box">
        <react_bootstrap_1.Col className="chat-messages">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === user.userId;
            const sender = isCurrentUser ? user : otherUser;
            const avatarUrl = isCurrentUser ? currentAvatar : otherAvatar;
            return (<div key={msg.messageId} className={`chat-message ${isCurrentUser ? "message-right" : "message-left"} ${msg.isNew ? "new-message" : ""}`}>
                {!isCurrentUser && (<img src={avatarUrl || "https://via.placeholder.com/40"} alt="Avatar" className="message-avatar"/>)}
                <div>
                  {!isCurrentUser && (<div className="message-sender">
                      {sender.firstName} {sender.lastName}
                    </div>)}
                  <div className={`bubble ${isCurrentUser ? "" : "bubble-left"}`}>
                    {msg.text && <p>{msg.text}</p>}
                    {msg.imageUrl && (<img src={msg.imageUrl} alt="Hình ảnh" className="message-image"/>)}
                  </div>
                </div>
                {isCurrentUser && (<img src={avatarUrl || "https://via.placeholder.com/40"} alt="Avatar" className="message-avatar"/>)}
              </div>);
        })}
          <div ref={messagesEndRef}></div>
        </react_bootstrap_1.Col>
      </react_bootstrap_1.Row>

      {/* Input Row */}
      <react_bootstrap_1.Row className="input-row">
        <react_bootstrap_1.Col xs={8}>
          <react_bootstrap_1.Form.Control type="text" placeholder="Nhập tin nhắn..." value={messageText} onChange={(e) => setMessageText(e.target.value)} className="message-input"/>
        </react_bootstrap_1.Col>
        <react_bootstrap_1.Col xs={2}>
          <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} className="image-input"/>
        </react_bootstrap_1.Col>
        <react_bootstrap_1.Col xs={2}>
          <react_bootstrap_1.Button onClick={handleSendMessage} disabled={loading} className="send-btn">
            Gửi
          </react_bootstrap_1.Button>
        </react_bootstrap_1.Col>
      </react_bootstrap_1.Row>


    </react_bootstrap_1.Container>);
};
exports.default = RoomChat;
