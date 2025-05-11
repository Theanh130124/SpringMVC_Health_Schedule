import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyContexts";
import { authApis, endpoint, fbApis } from "../../configs/Apis";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { load } from "react-cookies";
import MySpinner from "../layout/MySpinner";
import MyConfigs from "../../configs/MyConfigs";
import toast from "react-hot-toast";

const Appointment = () => {
    //Phân trang cho thằng này
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);
    const [msg, setMsg] = useState("");
    const [hasMore, setHasMore] = useState(true);

    const nav = useNavigate();

    // Tạo roomchat -> làm này xem thêm

    const [room, setRoom] = useState();


    //doctorId chỉ lấy 1 trong list appointment 

    //prev ghi lại dữ liệu -> dùng loading sẽ bị đè
    const createRoom = async (doctorId, appointment) => {
        try {
            setLoading(prev => ({ ...prev, [appointment.appointmentId]: true }));
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


        } catch (ex) {

            console.error(ex);



        }
        finally {
            setLoading(prev => ({ ...prev, [appointment.appointmentId]: false }));
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
            if (page === 1) {
                setAppointments(res.data);
            }
            else {

                setAppointments(prev => [...prev, ...res.data]);
            }
            if (res.data.length < MyConfigs.PAGE_SIZE) {
                setHasMore(false);
            }


        } catch (ex) {
            setMsg(`Đã có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
            console.error(ex);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setAppointments([]);
    }, []);


    useEffect(() => {

        loadAppointments();
    }, [page])


<<<<<<< HEAD

    //Truyen appointmentId sang Invoice
    const handleInvoiceRedirect = (appointment) => {       
=======
    const handleNavUpdate = (appointment) => {
        try {
            setLoading(true);
            const now = new Date().getTime();
            const createdAt = new Date(appointment.createdAt).getTime();
            const diffInMilliseconds = now - createdAt;
            if (diffInMilliseconds <= 24 * 60 * 60 * 1000) {
                nav("/updateAppointment", {
                    state: {
                        appointment
                    }
                });
            }else {
                toast.error("Bạn không thể sửa lịch hẹn sau 24 giờ!");
            }

        } catch (ex) {
             console.error("Lỗi khi kiểm tra thời gian:", ex);
        }
        finally {
            setLoading(false);
        }
    }


    const handlePaymentRedirect = (appointment) => {
>>>>>>> c5418e2685e46aed2fa0a4f84cbcc2684d1ed9e2
        if (appointment) {
            //Neu dung navigate thi nho bo {Link} o trong Button
            nav("/invoice", { state: { appointment } });
        }
    };



    return (
        <Container fluid className="p-0 container-custom">

            <Row className="g-4 mt-5">

                {appointments.length === 0 && <Alert variant="info" className="m-2 text-center">Bạn không có lịch hẹn nào!</Alert>}

                {appointments.map(a => (


                    <Col key={a.appointmentId} md={4} lg={4} xs={12}>
                        <Card className="card-doctor shadow-sm">
                            <Card.Body className="card-body-custom">
                                <div>
                                    <Card.Title className="card-title"> Ngày hẹn : {new Date(a.appointmentTime).toLocaleDateString("vi-VN")}
                                    </Card.Title>
                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        {user.role === "Patient" && (
                                            <>
                                                <strong>Bác sĩ khám:</strong> {a.doctorId.user.firstName} {a.doctorId.user.lastName}
                                                <br />
                                            </>
                                        )}
                                        {user.role === "Doctor" && (
                                            <>
                                                <strong>Bệnh nhân khám:</strong> {a.patientId.user.firstName} {a.patientId.user.lastName}
                                                <br />
                                            </>
                                        )}
                                        <strong>Bệnh viện:</strong> {a.clinicId.name}
                                        <br />
                                        <strong>Địa điểm khám:</strong> {a.clinicId.address}
                                        <br />



                                    </Card.Text>


                                    <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        <strong>Thời gian bắt đầu khám:</strong> {new Date(a.appointmentTime).toLocaleTimeString("vi-VN")}
                                        <br />
                                        <strong>Thời lượng cuộc hẹn:</strong> {a.durationMinutes} phút
                                        <br />
                                        <strong>Lý do khám:</strong> {a.reason}
                                        <br />
                                        <strong>Trạng thái cuộc hẹn:</strong> {a.status}
                                        <br />

                                    </Card.Text>

                                    <Card.Text className="card-text " style={{ fontSize: '0.85rem', color: 'red' }}>
                                        <strong>Lịch khám được đặt vào ngày :</strong>  {new Date(a.createdAt).toLocaleDateString("vi-VN")}
                                    </Card.Text>



                                    {/* Có lý do hủy có thể thêm */}

                                    {/* Đưa peerjs vào callvideo */}
                                    {/* <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        Link Videocall:
                                    </Card.Text> */}
                                </div>
                                {/* Fix ở bác sĩ thì là tên bệnh nhân */}
                                {user.role === "Doctor" && (
                                    <div className="d-grid gap-1 mt-2">
                                        {loading[a.appointmentId] === true ? (
                                            <MySpinner />
                                        ) : (
                                            <Button
                                                variant="success"
                                                onClick={() => createRoom(a.patientId.patientId, a)}
                                                size="sm"
                                            >
                                                Chat với bệnh nhân
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {user.role === "Patient" && (
                                    <div className="d-grid gap-1 mt-2">
                                        {/* Chỉ Bệnh nhân được sửa hoặc hủy lịch trong 24h */}
                                        {loading[a.appointmentId] === true ? (
                                            <MySpinner />
                                        ) : (
                                            <Button
                                                variant="success"
                                                onClick={() => createRoom(a.doctorId.doctorId, a)}
                                                size="sm"
                                            >
                                                Chat với bác sĩ
                                            </Button>
                                        )}

                                        <Button variant="primary" onClick={() => handleNavUpdate(a)} size="sm">
                                            Sửa lịch hẹn
                                        </Button>

                                        <Button variant="danger" as={Link} to="/" size="sm">
                                            Hủy lịch hẹn
                                        </Button>

<<<<<<< HEAD
                                        <Button variant="primary"  onClick={() => handleInvoiceRedirect(a)} size="sm">
                                            Xem hóa đơn
=======
                                        <Button variant="primary" onClick={() => handlePaymentRedirect(a)} size="sm">
                                            Thanh Toán
>>>>>>> c5418e2685e46aed2fa0a4f84cbcc2684d1ed9e2
                                        </Button>
                                    </div>
                                )}

                            </Card.Body>
                        </Card>


                    </Col>
                ))}


            </Row>

            <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {hasMore && appointments.length > 0 && !loading && (
                    <Col md={8} lg={6} xs={10}>
                        <Button variant="info" onClick={() => setPage((prev) => prev + 1)}>Xem thêm</Button>
                    </Col>
                )}
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