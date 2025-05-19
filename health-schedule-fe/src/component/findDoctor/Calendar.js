import { use, useContext, useEffect, useState } from "react";
import Apis, { endpoint } from "../../configs/Apis";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { load } from "react-cookies";
import MySpinner from "../layout/MySpinner";
import { Link, unstable_HistoryRouter, useLocation, useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/MyContexts";
import "../Styles/Calendar.css";
import LoadMoreButton from "../layout/LoadMoreButton";
import toast from "react-hot-toast";
import MyConfigs from "../../configs/MyConfigs";
import { authApis } from "../../configs/Apis";
import { Modal } from "react-bootstrap";

const Calendar = () => {

    const location = useLocation();
    const initialSlots = location.state?.slots || [];
    //Để lấy lịch từ xem lịch trống riêng bác sĩ

    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState(initialSlots);
    const [page, setPage] = useState(1);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [hasMore, setHasMore] = useState(true);

    
    const nav = useNavigate();
    const user = useContext(MyUserContext);



    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : "";
    const formattedTime = time ? `${time}:00` : "";

    
    //Theo doctorId ở bên Finddoctor.js -> nút xem lịch trống

    const loadSlots = async () => {
        try {
            setLoading(true);
            if (initialSlots.length > 0) {
                setSlots(initialSlots);
                setHasMore(false);
                return;
            }
            if (location.state?.doctorId) {
                url += `&doctorId=${location.state.doctorId}`;
            }

            let url = `${endpoint['findDoctor']}?page=${page}`;
            if (formattedDate) {
                url += `&slotDate=${formattedDate}`;
            }
            if (formattedTime) {
                url += `&startTime=${formattedTime}`;
            }
            const res = await Apis.get(url);
            if (page === 1) {
                setSlots(res.data);
            }
            else {
                setSlots(prev => [...prev, ...res.data]);
            }
            //dữ liệu cuối cùng gửi về < số lượng sp 1 trang
            if (res.data.length < MyConfigs.PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (initialSlots.length > 0) {
            setSlots(initialSlots);
            setPage(1);
            setHasMore(true);
            setSlots([]);
        } else {
            setPage(1);
            setHasMore(true);
            setSlots([]);
        }
    }, [date, time]);



    useEffect(() => {


        loadSlots();
    }, [page]);


    //Xử lý riêng k bỏ vào useEffect(() 
    const handleBookingClick = async (slot) => {
        if (user === null) {

            toast.error("Vui lòng đăng nhập để đặt lịch khám!");
            nav("/login");
            //Đăng nhập xong thì quay về trang này

        } else if (user.role == 'Patient') {
            
            //Truyền dữ liệu vào state
            nav("/booking", { state: { slot } });

        }

    };




    return (
        <Container fluid className="p-0 container-custom">


            <Row className="g-4 custom-row mt-5 align-items-center search-bar">
                <Col md={4} lg={4} xs={12}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-primary">Chọn ngày</Form.Label>
                        <Form.Control
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="rounded-pill shadow-sm"
                        />
                    </Form.Group>
                </Col>
                <Col md={4} lg={4} xs={12}>
                    <Form.Group>
                        <Form.Label className="fw-bold text-primary">Chọn giờ</Form.Label>
                        <Form.Control
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="rounded-pill shadow-sm"
                        />
                    </Form.Group>
                </Col>
                <Col md={4} lg={4} xs={12} className="text-center">
                    <Button
                        variant="primary"
                        className="search-button mt-4 rounded-pill px-4 shadow-sm"
                        onClick={loadSlots}
                    >
                        <i className="bi bi-search"></i> Tìm kiếm
                    </Button>
                </Col>
            </Row>
            <Row className="justify-content-center g-4 mt-5">
                <Col xs="auto">
                    <h1 className="calendar-title animated-title">Chọn lịch trống</h1>
                </Col>
            </Row>


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
                    <Col key={slot.slotId} md={4} lg={3} className="mb-4">
                        <Card className="card-doctor shadow-sm">
                            <Card.Img variant="top" src={slot.doctorId.userDTO.avatar} />
                            <Card.Body className="card-body-custom">
                                <Card.Title className="card-title">
                                    Bác sĩ: {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                </Card.Title>
                                <Card.Text className="card-text">
                                    <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong>Thời gian:</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    {slot.doctorId.specialties.map((s, index) => (
                                        <span key={index}>
                                            <strong>Chuyên môn:</strong> {s.name}
                                            <br />
                                        </span>
                                    ))}
                                    <strong>Phí khám:</strong> {slot.doctorId.consultationFee.toLocaleString('vi-VN')} VNĐ
                                </Card.Text>
                                <div className="text-center">
                                    <Button
                                        variant="success"
                                        className="rounded-pill px-4"
                                        onClick={() => handleBookingClick(slot)}
                                    >
                                        Đặt lịch
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>


            {/* Xem thêm */}

            <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {hasMore && slots.length > 0 && !loading && (
                    <Col md={8} lg={6} xs={10}>
                        <LoadMoreButton
                            hasMore={hasMore}
                            loading={loading}
                            onClick={() => setPage((prev) => prev + 1)}
                        />
                    </Col>
                )}
            </Row>
            <Row className="g-4 mb-4 mt-4"></Row>
        </Container>
    );
}
export default Calendar;