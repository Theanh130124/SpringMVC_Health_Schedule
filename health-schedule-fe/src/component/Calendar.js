import { useEffect, useState } from "react";
import Apis, { endpoint } from "../configs/Apis";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { load } from "react-cookies";
import MySpinner from "./layout/MySpinner";

const Calendar = () => {


    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [page, setPage] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : "";
    const formattedTime = time ? `${time}:00` : "";

    //Theo doctorId ở bên Finddoctor.js -> nút xem lịch trống

    const loadSlots = async () => {
        try {
            setLoading(true);
            let url = `${endpoint['findDoctor']}?page=${page}`;
            if (formattedDate) {
                url += `&slotDate=${formattedDate}`;
            }
            if (formattedTime) {
                url += `&startTime=${formattedTime}`;
            }
            const res = await Apis.get(url);

            setSlots(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
    }, [page]);


// Chỉnh PAGE_SIZE LẠI 1 TRANG 8 DOCTOR
    return (
        <Container fluid className="p-0">
            <Row className="justify-content-center g-4 custom-row mt-5">
                <Col md={4} lg={4} xs={12}>
                    <Form.Group>
                        <Form.Label>Chọn ngày</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={4} lg={4} xs={12}>
                    <Form.Group>
                        <Form.Label>Chọn giờ</Form.Label>
                        <Form.Control
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={4} lg={4} xs={12}>
                    <Button variant="primary" onClick={loadSlots}>
                        Tìm kiếm
                    </Button>
                </Col>
            </Row>

            
{/* CSS cho đều lại card */}
            <Row className="justify-content-center g-4  mt-5">
                {loading && (
                    <div className="text-center">
                        <MySpinner />
                    </div>
                )}
                {slots.length === 0 && (
                    <Alert variant="info" className="text-center">
                        Không tìm thấy lịch trống nào!
                    </Alert>
                )}
                {slots.map((slot) => (
                    <Col key={slot.slotId} md={4} lg={2} className="mb-3">
                        <Card>
                            <Card.Img variant="top" src={slot.doctorId.user.avatar} />
                            <Card.Body>
                                <Card.Title>
                                    {slot.doctorId.user.firstName} {slot.doctorId.user.lastName}
                                </Card.Title>
                                <Card.Text>
                                    <strong>Thời gian:</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    <strong>Ngày:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong>Chuyên môn:</strong> {slot.doctorId.bio}
                                </Card.Text>
                                <Button variant="success">Đặt lịch</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
export default Calendar;