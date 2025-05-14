import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/MyContexts";
import toast from "react-hot-toast";
import { authApis, authformdataApis, endpoint } from "../../configs/Apis";
import { Alert, Button, Card, Col, Container, Image, Modal, Row, Table } from "react-bootstrap";
import MySpinner from "../layout/MySpinner";
import { Form } from "react-bootstrap";




const DoctorAvailability = () => {

    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const [availabilities, setAvailabilities] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDelete, setShowdelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    const [newAvailability, setNewAvailability] = useState({
        dayOfWeek: "",
        startTime: "",
        endTime: ""
    });
    const normalizeTime = (t) => {
        if (!t) return "";
        return t.length === 5 ? t + ":00" : t  // "08:00" => "08:00:00"


    }


    const loadAvailability = async () => {
        try {
            setLoading(true);
            let res = await authApis().get(endpoint.getAvailability(user.userId));
            setAvailabilities(res.data);

        }
        catch (error) {
            toast.error("Lỗi khi tải danh sách lịch làm")
            console.log("Lỗi tải danh sách lịch làm " + error)
            // console.log("user:", user);
            // console.log("availabilities:", availabilities);

        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadAvailability();
    }, [])


    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newAvailability.dayOfWeek || !newAvailability.startTime || !newAvailability.endTime) {
            toast.error("Vui lòng nhập đầy đủ thông tin lịch làm !")
            return;
        }
        try {
            setLoading(true);
            await authApis().post(endpoint.availability, {
                doctorId: user.userId,
                dayOfWeek: newAvailability.dayOfWeek,
                startTime: normalizeTime(newAvailability.startTime),
                endTime: normalizeTime(newAvailability.endTime)
            });
            toast.success("Tạo lịch làm việc thành công!")
            setNewAvailability({ dayOfWeek: "", startTime: "", endTime: "" });
            loadAvailability();
        } catch (error) {
            toast.error("Tạo lịch làm việc thất bại!");
        } finally {
            setLoading(false);
        }
    }

    // Sửa lịch làm việc
    const handleEdit = (item) => {
        setEditData({
            ...item,
            endTime: item.endTime,
        });
        setShowEdit(true);
    };

    const handleUpdate = async () => {
        setShowConfirm(false);
        try {
            setLoading(true);
            await authApis().patch(endpoint.updateAvailability(editData.availabilityId), {
                doctorId: user.userId,
                dayOfWeek: editData.dayOfWeek,
                startTime: normalizeTime(editData.startTime),
                endTime: normalizeTime(editData.endTime)
            });
            toast.success("Cập nhật thành công!");
            setShowEdit(false);
            loadAvailability();
        } catch (err) {
            toast.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    }
    const handleDelete = async() => {

        try {
            setShowdelete(false);
            setLoading(true);
            await authApis().delete(endpoint.deleteAvailability(deleteId));
            toast.success("Xóa lịch làm việc thành công!")
            loadAvailability();
        } catch (error) {
            console.log("Lỗi khi xóa lịch làm việc" + error)
            toast.error("Xóa lịch làm việc thất bại !")
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <Container fluid className="p-0 mt-4 ">

            <h2
                className="mb-4 text-center py-3"
                style={{
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
            >
                <i className="bi bi-calendar2-week me-2" style={{ color: "#0d6efd", fontSize: 32, verticalAlign: "middle" }}></i>
                Lịch làm việc của bạn
            </h2>
            <Card className="mb-4 shadow">
                <Card.Body>
                    <Row className="justify-content-center align-items-center">
                        <Col md={2}>
                            <Image src={user.avatar} roundedCircle width={80} height={80} />
                        </Col>
                        <Col>
                            <h5>{user.firstName} {user.lastName}</h5>
                            <div><strong>Email:</strong> {user.email}</div>
                        </Col>
                    </Row>
                </Card.Body>

            </Card>

            {/* Tạo lịch */}

            <Card className="mb-4">
                <Card.Body>
                    <Form onSubmit={handleCreate} className="row g-2 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Thứ</Form.Label>
                                <Form.Select
                                    value={newAvailability.dayOfWeek}
                                    onChange={e => setNewAvailability({ ...newAvailability, dayOfWeek: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn thứ</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Giờ bắt đầu</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={newAvailability.startTime}
                                    onChange={e => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Giờ kết thúc</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={newAvailability.endTime}
                                    onChange={e => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button type="submit" variant="success" className="w-100">
                                <i className="bi bi-plus-circle me-2"></i> Tạo mới
                            </Button>
                        </Col>
                    </Form>
                </Card.Body>
            </Card>


            {loading ? (
                <div className="text-center"><MySpinner /></div>
            ) : availabilities.length === 0 ? (
                <Alert variant="info">Chưa có lịch làm việc nào!</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Thứ</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilities.map(a => (
                            <tr key={a.availabilityId}>
                                <td>{a.dayOfWeek}</td>
                                <td>{a.startTime}</td>
                                <td>{a.endTime}</td>
                                <td>
                                    {a.isAvailable ? (
                                        <span className="text-success">Có mặt</span>
                                    ) : (
                                        <span className="text-danger">Nghỉ</span>
                                    )}
                                </td>
                                <td>{new Date(a.createdAt).toLocaleString("vi-VN")}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEdit(a)}
                                        className="me-2"
                                    >
                                        <i className="bi bi-pencil-square"></i>Sửa lịch làm việc
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => {
                                            setDeleteId(a.availabilityId);
                                            setShowdelete(true);
                                        }}
                                    >
                                        <i className="bi bi-trash"></i> Xoá
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal sửa */}
            <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-pencil-square me-2"></i>
                        Sửa lịch làm việc
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Thứ</Form.Label>
                            <Form.Select
                                value={editData.dayOfWeek || ""}
                                onChange={e => setEditData({ ...editData, dayOfWeek: e.target.value })}
                            >
                                <option value="">Chọn thứ</option>
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giờ bắt đầu mới</Form.Label>
                            <Form.Control
                                type="time"
                                value={editData.startTime || ""}
                                onChange={e => setEditData({ ...editData, startTime: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giờ kết thúc mới</Form.Label>
                            <Form.Control
                                type="time"
                                value={editData.endTime || ""}
                                onChange={e => setEditData({ ...editData, endTime: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setShowConfirm(true)}
                    >
                        <i className="bi bi-check-circle me-2"></i>
                        Xác nhận sửa
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Model xóa */}
            <Modal show={showDelete} onHide={() => setShowdelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa lịch làm việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn xóa lịch làm việc không ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowdelete(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <i className="bi bi-trash"></i> Xoá
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận sửa lịch làm việc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn cập nhật giờ kết thúc thành <b>{editData.endTime}</b> cho lịch làm việc này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="success" onClick={handleUpdate}>
                        <i className="bi bi-check-circle me-2"></i>
                        Đồng ý
                    </Button>
                </Modal.Footer>
            </Modal>


        </Container>



    )


}
export default DoctorAvailability;