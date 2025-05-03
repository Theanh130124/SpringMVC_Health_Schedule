import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import { authApis, endpoint, fbApis } from "../configs/Apis";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { load } from "react-cookies";
import MySpinner from "./layout/MySpinner";

const Appointment = () => {

    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);
    const [msg, setMsg] = useState("");

    const nav = useNavigate();

    // Tạo roomchat

    const [room ,setRoom] = useState();


    //doctorId chỉ lấy 1 trong list appointment 


    const createRoom = async (doctorId , appointment) => {   
        try {
            let res = await fbApis().post(endpoint['chats'], {
                "userId1": user.userId,
                "userId2": doctorId,
            });
            const roomData = res.data;
            //truyền appointment vào để lấy thông tin của doctor 
            nav("/roomchat", {
                state: {
                    room: roomData,
                    appointment: appointment
                }, 
            });


        }catch (ex) {

            console.error(ex);



    }
    }


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
                                     <Card.Text  className="card-text" style={{ fontSize: '0.85rem' }}>
                                        
                                        
                                         
                                        <strong>Bác sĩ khám</strong> {a.doctorId.user.firstName} {a.doctorId.user.lastName}
                                        <br />
                                            <strong>Bệnh viện</strong> {a.clinicId.name}
                                        <br /> 
                                        <strong>Địa điểm khám</strong> {a.clinicId.address}
                                        <br />  

                                        {/* Xử lý parse sau */}
                                        {/* <strong>Thời gian </strong> {a.clinicId.appointmentTime} 
                                        <br /> */}
                                          

                                       

                                        </Card.Text>
                                       
                                        <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Thời lượng cuộc hẹn:</strong> {a.durationMinutes} phút
                                            <br />
                                            <strong>Lý do khám:</strong> {a.reason}
                                            <br />
                                            <strong>Trạng thái cuộc hẹn:</strong> {a.status}
                                            <br />
                                            <strong>Loại cuộc hẹn:</strong> {a.consultationType}
                                            <br />
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


                                        {/* Chỉ lấy doctorId được click */}
                                        <Button variant="success"  onClick={() => createRoom(a.doctorId.doctorId , a)}  size="sm">Chat với bác sĩ</Button>

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