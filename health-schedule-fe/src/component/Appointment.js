import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import { authApis, endpoint } from "../configs/Apis";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { load } from "react-cookies";
import MySpinner from "./layout/MySpinner";

const Appointment = () => {

    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);
    const [msg, setMsg] = useState("");


    const loadAppointments = async () => {
        try {

            setLoading(true);
            let url = `${endpoint['listAppointment']}?page=${page}`;


            if (user.userId !== null) {
                if (user.role === "Patient") {
                    url += `&patientId=${user.userId}`;
                }
                if (user.role === "Doctor") {
                    url += `&doctorId=${user.userId}`;
                }
            }
            const res = await authApis().get(url);
            setAppointments(res.data);



        } catch (ex) {
            setMsg(`Đã có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
            console.error(ex);
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        loadAppointments();
    }, [page])






    return (
        <Container fluid className="p-0 container-custom">

            <Row className="g-4 mt-5">

                {appointments.length === 0 && <Alert variant="info" className="m-2 text-center">Bạn không có lịch hẹn nào!</Alert>}

                {appointments.map(a => (


                    <Col key={a.appointmentId} md={4} lg={4} xs={12}>
                        <Card className="card-doctor shadow-sm">
                            <Card.Body className="card-body-custom">
                                <div>
                                    <Card.Title className="card-title"> Ngày hẹn : { new Date (a.appointmentTime).toLocaleDateString("vi-VN")}
                                    </Card.Title>
                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Thời lượng cuộc hẹn: {a.durationMinutes} phút
                                    </Card.Text>
                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Lý do khám: {a.reason}
                                    </Card.Text>
                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Trạng thái cuộc hẹn: {a.status}
                                    </Card.Text>
                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Loại cuộc hẹn: {a.consultationType}
                                    </Card.Text>


                                    {/* Có lý do hủy có thể thêm */}

                                    {/* Đưa peerjs vào callvideo */}
                                    {/* <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Link Videocall:
                                    </Card.Text> */}
                                </div>

                                {user.role === "Patient" ? <>
                                    <div className="d-grid gap-1 mt-2">
                                        {/* Chỉ Bệnh nhân được sửa hoặc hủy lịch trong 24h  */}
                                        {/* Tới trang sửa */}


                                        <Button variant="primary" as={Link} to="/" size="sm">Sửa lịch hẹn</Button>

                                        {/* Thêm Alert bạn chắc chứ */}
                                        <Button variant="danger" as={Link} to="/" size="sm">Hủy lịch hẹn</Button>


                                    </div>

                                </> : <>
                                </>
                                }
                            </Card.Body>
                        </Card>


                    </Col>
                ))}


            </Row>


            <Row className="mt-5 mb-4" ></Row>


            {loading && (

                <div className="text-center mt-4">
                    <MySpinner />
                </div>
            )}
        </Container>
    )
}
export default Appointment;