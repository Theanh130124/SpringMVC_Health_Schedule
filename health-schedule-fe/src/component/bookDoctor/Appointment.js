import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyContexts";
import { authApis, endpoint, fbApis } from "../../configs/Apis";
import { Alert, Button, Card, Col, Container, Row, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { load } from "react-cookies";
import MySpinner from "../layout/MySpinner";
import MyConfigs from "../../configs/MyConfigs";
import toast from "react-hot-toast";
import MyConfirm from "../layout/MyConfirm";
import cookie from 'react-cookies'

const Appointment = () => {
    //Phân trang cho thằng này
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);
    const [msg, setMsg] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [showConfirm, setShowConfirm] = useState({
        show: false,
        appointmentId: null,
        doctorId: null,
        createdAt: null,
    });

    const nav = useNavigate();

    // Tạo roomchat -> làm này xem thêm

    const [room, setRoom] = useState();
    const [reviewedAppointments, setReviewedAppointments] = useState({});

    // State cho chỉnh sửa
    const [showEdit, setShowEdit] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [records, setRecords] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    //doctorId chỉ lấy 1 trong list appointment 

    const [showCompleteConfirm, setShowCompleteConfirm] = useState(null);
    // Hàm xác nhận hoàn thành
    const handleCompleteAppointment = async (appointmentId) => {
        try {
            setLoading(prev => ({ ...prev, [appointmentId]: true }));
            console.log(appointmentId)
            await authApis().patch(`/appointment/${appointmentId}`, {
                status: "Completed"
            });
            toast.success("Đã xác nhận khám xong!");
            await loadAppointments();
        } catch (err) {
            toast.error(err.response.data.error);
        } finally {
            setLoading(prev => ({ ...prev, [appointmentId]: false }));
            setShowCompleteConfirm(null);
        }
    };

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

    const deleteAppointment = async (appointmentId, doctorId, createdAt) => {
        try {
            setLoading(true);

            // Kiểm tra thời gian tạo lịch hẹn
            const now = new Date().getTime();
            const createdTime = new Date(createdAt).getTime();
            const diffInMilliseconds = now - createdTime;

            if (diffInMilliseconds > 24 * 60 * 60 * 1000) {
                toast.error("Bạn không thể hủy lịch hẹn sau 24 giờ!");
                return; // Dừng thực hiện nếu quá 24 giờ
            }

            // Gửi yêu cầu xóa lịch hẹn
            await authApis().delete(endpoint['deleteBookDoctor'](appointmentId), {
                data: { doctorId: doctorId },
            });

            await loadAppointments();
            toast.success("Hủy lịch thành công!");
        } catch (ex) {
            toast.error("Hủy lịch thất bại!");
            console.error("Lỗi khi hủy lịch:", ex);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };



    const loadAppointments = async () => {
        try {

            setPageLoading(true);
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

            // Load review cho từng appointment
            const reviewResults = {};
            await Promise.all(res.data.map(async (a) => {
                try {
                    const reviewRes = await authApis().get(`reviews/appointment/${a.appointmentId}`);
                    reviewResults[a.appointmentId] = !!reviewRes.data; // true nếu đã review
                } catch {
                    reviewResults[a.appointmentId] = false;
                }
            }));
            setReviewedAppointments(prev => ({ ...prev, ...reviewResults }));


        } catch (ex) {
            setMsg(`Đã có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
            console.error(ex);
        }
        finally {
            setPageLoading(false);
        }
    }

    const loadReviewOfAppointment = async (appointmentId) => {
        try {
            setLoading(true);
            const res = await authApis().get(`reviews/appointment/${appointmentId}`);
            return res.data;
        } catch (ex) {
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
            } else {
                toast.error("Bạn không thể sửa lịch hẹn sau 24 giờ!");
            }

        } catch (ex) {
            console.error("Lỗi khi kiểm tra thời gian:", ex);
        }
        finally {
            setLoading(false);
        }
    }


    const handleInvoiceRedirect = (appointment) => {
        if (appointment) {
            //Neu dung navigate thi nho bo {Link} o trong Button
            nav("/invoice", { state: { appointment } });
        }
    };

    const handleReviewDoctorRedirect = (doctor, appointmentId, patientId) => {
        if (doctor) {
            //Neu dung navigate thi nho bo {Link} o trong Button
            nav("/doctorReview", { state: { doctor, appointmentId, patientId } });
        }
    };
    const handleConfirm = (appointmentId, doctorId, createdAt) => {
        const now = new Date().getTime();
        const createdTime = new Date(createdAt).getTime();
        const diffInMilliseconds = now - createdTime;

        if (diffInMilliseconds > 24 * 60 * 60 * 1000) {
            toast.error("Bạn không thể hủy lịch hẹn sau 24 giờ!");
            return;
        }

        setShowConfirm({
            show: true,
            appointmentId,
            doctorId,
            createdAt,
        });
    };

    const handleClose = () => {
        setShowConfirm(false);
    };

    const handleEdit = async (appointment) => {
        try {
            setLoading(true);
            const res = await authApis().get("/health-record", {
                params: {
                    appointmentId: appointment.appointmentId,
                    userId: appointment.patientId.user.userId
                }
            });
            setShowEdit(true);
            setEditRecord(res.data);
        } catch (ex) {
            console.error("Lỗi khi lấy thông tin hồ sơ:", ex);
        }
        finally {
            setLoading(false);
        }


    };

    const handleEditChange = (e) => {
        setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const formData = new FormData();
            formData.append("symptoms", editRecord.symptoms || "");
            formData.append("diagnosis", editRecord.diagnosis || "");
            formData.append("prescription", editRecord.prescription || "");
            formData.append("notes", editRecord.notes || "");
            console.log(editRecord)
            const res = await authApis().patch(`/health-record/${editRecord.recordId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.status === 200) {
                setRecords(records.map(r => r.recordId === editRecord.recordId ? res.data : r));
                setShowEdit(false);
            }
        } catch {
            alert("Cập nhật thất bại!");
        }
        finally {
            setUpdateLoading(false);
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
                                        <strong>Lịch khám được đặt vào ngày :</strong>  {new Date(a.createdAt).toLocaleString("vi-VN")}
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
                                            <>
                                                <Button
                                                    variant="success"
                                                    className="d-flex align-items-center justify-content-center mb-1"
                                                    onClick={() => createRoom(a.patientId.patientId, a)}
                                                    size="sm"
                                                    disabled={
                                                        Object.values(loading).some(v => v) && !loading[a.appointmentId]
                                                    }
                                                >
                                                    <i className="bi bi-chat-dots me-1"></i> Chat với bệnh nhân
                                                </Button>

                                                {(a.status === "Scheduled") && (
                                                    <Button
                                                        variant="warning"
                                                        className="d-flex align-items-center justify-content-center mb-1"
                                                        onClick={() => setShowCompleteConfirm(a.appointmentId)}
                                                        size="sm"
                                                        disabled={Object.values(loading).some(v => v) && !loading[a.appointmentId]}
                                                    >
                                                        <i className="bi bi-check2-circle me-1"></i> Xác nhận đã khám xong
                                                    </Button>
                                                )}

                                                {/* Modal xác nhận hoàn thành lịch hẹn */}
                                                <Modal show={!!showCompleteConfirm} onHide={() => setShowCompleteConfirm(null)}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Xác nhận hoàn thành</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>Bạn có chắc chắn muốn xác nhận đã khám xong lịch hẹn này?</Modal.Body>
                                                    <Modal.Body>Sau khi xác nhận sẽ không thể sửa</Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => setShowCompleteConfirm(null)}>
                                                            Hủy
                                                        </Button>
                                                        <Button
                                                            variant="warning"
                                                            onClick={() => handleCompleteAppointment(showCompleteConfirm)}
                                                            disabled={loading[showCompleteConfirm]}
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>

                                                {a.status === "Completed" && (
                                                    <Button
                                                        variant="primary"
                                                        disabled={loading[a.appointmentId] === true}
                                                        onClick={() => handleEdit(a)}
                                                        size="sm"
                                                    >
                                                        <i className="bi bi-journal-medical me-1"></i>
                                                        Cập nhật hồ sơ bệnh án
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
                                    </Modal.Header>
                                    <Form onSubmit={handleEditSubmit}>
                                        <Modal.Body>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Triệu chứng</Form.Label>
                                                <Form.Control
                                                    name="symptoms"
                                                    value={editRecord?.symptoms || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-2">
                                                <Form.Label>Chẩn đoán</Form.Label>
                                                <Form.Control
                                                    name="diagnosis"
                                                    value={editRecord?.diagnosis || ""}
                                                    readOnly={user.role !== "Doctor"}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Toa thuốc</Form.Label>
                                                <Form.Control
                                                    name="prescription"
                                                    value={editRecord?.prescription || ""}
                                                    readOnly={user.role !== "Doctor"}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Ghi chú</Form.Label>
                                                <Form.Control
                                                    name="notes"
                                                    value={editRecord?.notes || ""}
                                                    onChange={handleEditChange}
                                                />
                                            </Form.Group>
                                        </Modal.Body>


                                        {updateLoading ? (
                                            <MySpinner />) :
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setShowEdit(false)}>
                                                    Hủy
                                                </Button>
                                                <Button type="submit" variant="primary">
                                                    Lưu
                                                </Button>
                                            </Modal.Footer>
                                        }


                                    </Form>
                                </Modal>

                                {user.role === "Patient" && (
                                    <div className="d-grid gap-1 mt-2">
                                        {/* Chỉ Bệnh nhân được sửa hoặc hủy lịch trong 24h */}
                                        {loading[a.appointmentId] === true ? (
                                            <MySpinner />
                                        ) : (
                                            <Button
                                                variant="success"
                                                className="d-flex align-items-center justify-content-center mb-1"
                                                onClick={() => createRoom(a.doctorId.doctorId, a)}
                                                size="sm"
                                                disabled={

                                                    Object.values(loading).some(v => v) && !loading[a.appointmentId]
                                                }
                                                title="Chat với bác sĩ"
                                            >
                                                <i className="bi bi-chat-dots me-1"></i> Chat với bác sĩ
                                            </Button>
                                        )}


                                        {a.status === "Scheduled" && (
                                            <div className="d-flex gap-1 mb-1">

                                                <Button variant="primary" onClick={() => handleNavUpdate(a)} size="sm"
                                                    disabled={loading}
                                                    className="d-flex align-items-center"
                                                    title="Sửa lịch hẹn"
                                                >

                                                    <i className="bi bi-pencil-square me-1"></i> Sửa
                                                </Button>


                                                <Button
                                                    variant="danger"
                                                    disabled={loading}
                                                    className="d-flex align-items-center"
                                                    onClick={() => handleConfirm(a.appointmentId, a.doctorId.doctorId, a.createdAt)}
                                                    size="sm"
                                                    title="Hủy lịch hẹn"
                                                >
                                                    <i className="bi bi-x-circle me-1"></i> Hủy
                                                </Button>
                                            </div>)}

                                        {a.status === "Completed" && !reviewedAppointments[a.appointmentId] ? (
                                            <Button variant="primary" title="Đánh giá bác sĩ" className="d-flex align-items-center" disabled={loading} onClick={() => handleReviewDoctorRedirect(a.doctorId, a.appointmentId, a.patientId.patientId)} size="sm">
                                                <i className="bi bi-star me-1"></i> Đánh giá
                                            </Button>
                                        ) : (
                                            <Button variant="primary" disabled={loading} as={Link} to={`/review/?doctorId=${a.doctorId.doctorId}`} size="sm">
                                                Xem đánh giá
                                            </Button>
                                        )}

                                        <Button variant="info" disabled={loading} onClick={() => handleInvoiceRedirect(a)} size="sm"
                                            title="Xem hóa đơn">
                                            <i className="bi bi-receipt me-1"></i> Hóa đơn

                                        </Button>
                                    </div>
                                )}

                            </Card.Body>
                        </Card>

                        <MyConfirm
                            show={showConfirm.show}
                            onHide={handleClose}
                            onConfirm={() =>
                                deleteAppointment(
                                    showConfirm.appointmentId,
                                    showConfirm.doctorId,
                                    showConfirm.createdAt
                                )
                            }
                            loading={loading}
                            title="Xác nhận hủy lịch"
                            body="Bạn có chắc chắn muốn hủy lịch hẹn này không?"
                        />


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


            {pageLoading && (
                <div className="text-center mt-4">
                    <MySpinner />
                </div>
            )}
        </Container>
    )
}
export default Appointment;