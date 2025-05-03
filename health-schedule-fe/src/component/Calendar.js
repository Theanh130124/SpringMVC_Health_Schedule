import { use, useContext, useEffect, useState } from "react";
import Apis, { endpoint } from "../configs/Apis";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { load } from "react-cookies";
import MySpinner from "./layout/MySpinner";
import { Link, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";

import { useHistory } from 'react-router-dom';
import toast from "react-hot-toast";

const Calendar = () => {

    
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
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
            //1 trang 8 bác sĩ
            if (res.data.length < 8) {
                setHasMore(false);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setSlots([]);

    }, [date, time]);


    useEffect(() => {


        loadSlots();
    }, [page]);


    //Xử lý riêng k bỏ vào useEffect(() 
    const handleBookingClick = (slot) => {
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


            <Row className="g-4 custom-row mt-5">
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
                <Col md={4} lg={4} xs={12} >



                    <Button variant="primary" className="search-button mt-4" onClick={loadSlots}>
                        Tìm kiếm
                    </Button>


                </Col>


            </Row>
            <Row className="justify-content-center g-4 mt-5">
                <Col xs="auto">
                    <h1 className="calendar-title">Chọn lịch trống</h1>
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
                    <Col key={slot.slotId} md={4} lg={2} className="mb-3">
                        <Card>
                            <Card.Img variant="top" src={slot.doctorId.userDTO.avatar} />
                            <Card.Body className="card-body-custom">
                                <Card.Title>
                                    {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                </Card.Title>
                                <Card.Text className="card-text">
                                    <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong >Thời gian</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    <strong>Chuyên môn:</strong> {slot.doctorId.specialties[0].name}
                                </Card.Text>

                                {/* Sẽ bị mất khi re-render */}
                                <Button variant="success" onClick = { () => {handleBookingClick(slot)}}>
                                    Đặt lịch
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>


            {/* Xem thêm */}

            <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {hasMore && slots.length > 0 && !loading && (
                    <Col md={1} lg={1} xs={1}>
                        <Button variant="info" onClick={() => setPage(prev => prev + 1)} > Xem thêm</Button>
                    </Col>
                )}
            </Row>
            <Row className="g-4 mb-4 mt-4"></Row>


        </Container>
    );
}
export default Calendar;