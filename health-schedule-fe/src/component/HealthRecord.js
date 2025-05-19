import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import MySpinner from "./layout/MySpinner";
import { authApis } from "../configs/Apis";
import { Form, Button, Alert, Modal } from "react-bootstrap";

const HealthRecord = () => {
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState(null);
    const [message, setMessage] = useState("");
    const user = useContext(MyUserContext);
    const [updateLoading, setUpdateLoading] = useState(false);
    // State cho chỉnh sửa/tạo mới
    const [showEdit, setShowEdit] = useState(false);
    const [editRecord, setEditRecord] = useState({});

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const response = await authApis().get(`/health-record`);
                if (response.status === 200 && response.data) {
                    setRecord(response.data);
                } else {
                    setRecord(null);
                    setMessage("Không tìm thấy hồ sơ bệnh án.");
                }
            } catch (error) {
                setRecord(null);
                setMessage("Không tìm thấy hồ sơ bệnh án.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const handleEdit = (record) => {
        setEditRecord(record);
        setShowEdit(true);
    };

    const handleEditChange = (e) => {
        setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
    };

    // Chỉnh sửa hồ sơ
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const formData = new FormData();
            formData.append("symptoms", editRecord.symptoms || "");
            formData.append("diagnosis", editRecord.diagnosis || "");
            formData.append("prescription", editRecord.prescription || "");
            formData.append("notes", editRecord.notes || "");
            const res = await authApis().patch(`/health-record/${editRecord.recordId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.status === 200) {
                setRecord(res.data);
                setShowEdit(false);
            }
        } catch {
            alert("Cập nhật thất bại!");
        } finally {
            setUpdateLoading(false);
        }
    };

    // Tạo mới hồ sơ
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const formData = new FormData();
            formData.append("symptoms", editRecord.symptoms || "");
            formData.append("notes", editRecord.notes || "");       
            formData.append("userId", user.userId);
            const res = await authApis().post(`/health-record`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.status === 201 || res.status === 200) {
                setRecord(res.data);
                setShowEdit(false);
            }
        } catch {
            alert("Tạo hồ sơ thất bại!");
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            {loading ? (
                <MySpinner />
            ) : (
                <>
                    {!record ? (
                        <div className="d-flex flex-column align-items-center">
                            <Alert variant="info" className="text-center mb-3">
                                {message || "Chưa có hồ sơ bệnh án."}
                            </Alert>
                            
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="col-md-8 col-lg-6">
                                <div className="card shadow-lg border-0 rounded-4">
                                    <div className="card-body p-4">
                                        <h4 className="card-title text-primary fw-bold mb-3 d-flex align-items-center">
                                            <i className="bi bi-journal-medical me-2"></i>
                                            Hồ sơ bệnh án
                                            <span className="badge bg-info ms-3">#{record.recordId}</span>
                                        </h4>
                                        <ul className="list-group list-group-flush mb-4">
                                            <li className="list-group-item">
                                                <i className="bi bi-activity me-2 text-success"></i>
                                                <strong>Triệu chứng:</strong> <span className="ms-1">{record.symptoms || <span className="text-danger">Chưa cập nhật</span>}</span>
                                            </li>
                                            <li className="list-group-item">
                                                <i className="bi bi-calendar-event me-2 text-primary"></i>
                                                <strong>Lịch hẹn:</strong>
                                                <span className="ms-1">
                                                    {record.appointmentId && record.appointmentId.appointmentTime
                                                        ? new Date(record.appointmentId.appointmentTime).toLocaleString()
                                                        : <span className="text-danger">Chưa cập nhật</span>}
                                                </span>
                                            </li>
                                            <li className="list-group-item">
                                                <i className="bi bi-clipboard2-pulse me-2 text-warning"></i>
                                                <strong>Chẩn đoán:</strong> <span className="ms-1">{record.diagnosis || <span className="text-danger">Chưa cập nhật</span>}</span>
                                            </li>
                                            <li className="list-group-item">
                                                <i className="bi bi-capsule-pill me-2 text-info"></i>
                                                <strong>Toa thuốc:</strong> <span className="ms-1">{record.prescription || <span className="text-danger">Chưa cập nhật</span>}</span>
                                            </li>
                                            <li className="list-group-item">
                                                <i className="bi bi-journal-text me-2 text-secondary"></i>
                                                <strong>Ghi chú:</strong> <span className="ms-1">{record.notes || <span className="text-danger">Chưa cập nhật</span>}</span>
                                            </li>
                                        </ul>
                                        <div className="text-end">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(record)}>
                                                <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal chỉnh sửa */}
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
                                            <Form.Label>Lịch hẹn</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={
                                                    editRecord?.appointmentId && editRecord.appointmentId.appointmentTime
                                                        ? `Ngày Khám: ${new Date(editRecord.appointmentId.appointmentTime).toLocaleString()}`
                                                        : "Chưa có lịch hẹn"
                                                }
                                                readOnly
                                                plaintext
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Chẩn đoán</Form.Label>
                                            <Form.Control
                                                name="diagnosis"
                                                value={editRecord?.diagnosis || "Chưa có cập nhật từ bác sĩ"}
                                                readOnly={user.role !== "Doctor"}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Toa thuốc</Form.Label>
                                            <Form.Control
                                                name="prescription"
                                                value={editRecord?.prescription || "Chưa có cập nhật từ bác sĩ"}
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
                                        <div className="d-flex justify-content-center my-3">
                                            <MySpinner />
                                        </div>
                                    ) : (
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowEdit(false)}>
                                                Hủy
                                            </Button>
                                            <Button type="submit" variant="primary">
                                                Lưu
                                            </Button>
                                        </Modal.Footer>
                                    )}
                                </Form>
                            </Modal>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HealthRecord;