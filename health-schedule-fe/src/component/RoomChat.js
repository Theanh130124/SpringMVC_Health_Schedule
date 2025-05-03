import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { endpoint, fbApis } from "../configs/Apis";


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

  // const { roomId } = useParams();

  const doctor = appointment?.doctorId?.user;
  const patient = appointment?.patientId?.user;
  const otherUser = user.userId === doctor.userId ? patient : doctor;

  const chatId = room?.chatId; //Lấy hết tin nhắn




  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fbApis().get(endpoint.chatMessages(chatId));
      setMessages(res.data.sort((a, b) => a.timestamp - b.timestamp));
    } catch (error) {
      console.error("Xảy ra lỗi khi gửi tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!messageText && !imageFile)
        return;
      setLoading(true);



      let imageUrl = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        let res = await fbApis().post(endpoint.uploadFile, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageFile = res.data.imageUrl;

      }
      await fbApis().post(endpoint.chatMessages(chatId), {
        senderId: user.userId,
        text: messageText,
        imageUrl: imageUrl,
        timestamp: Date.now(),
      });
      // Làm mới
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
    fetchMessages();
  }, [chatId]);

  //Tự động cuôn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <>
      <Container>

        <Row>
          <Col>
            {/* current_user */}
            <div className="current_user">
              <h4>Người dùng hiện tại: {user.firstName} {user.lastName}</h4>

            </div>

            {/* Người còn lại */}
            <div className="other_user">
              <h4>Người dùng còn lại: {appointment.doctorId.user.firstName} {appointment.doctorId.user.lastName}</h4>
            </div>







          </Col>

        </Row>

        <Row>
          <Col style={{ height: "400px", overflowY: "auto", border: "1px solid #ccc", marginTop: "10px" }}>
            {messages.map(msg => (
              <div key={msg.messageId} style={{ marginBottom: "10px" }}>
                <b>{msg.senderId === user.userId ? "Bạn" : otherUser.firstName}:</b>
                <p>{msg.text}</p>
                {msg.imageUrl && <img src={msg.imageUrl} alt="Hình ảnh" width="200" />}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </Col>
        </Row>

        <Row style={{ marginTop: "10px" }}>
          <Col>
            <Form.Control
              type="text"
              placeholder="Nhập tin nhắn"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control type="file" onChange={e => setImageFile(e.target.files[0])} />
          </Col>
          <Col>
            <Button onClick={handleSendMessage} disabled={loading}>
              Gửi
            </Button>
          </Col>
        </Row>
      </Container>

    </>
  );
}
export default RoomChat;