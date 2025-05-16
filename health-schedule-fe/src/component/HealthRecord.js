import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MyUserContext } from "../configs/MyContexts";
import MySpinner from "./layout/MySpinner";
import { authApis } from "../configs/Apis";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { upload } from "@testing-library/user-event/dist/upload";

const HealthRecord = () => {
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(1);
    const user = useContext(MyUserContext);
    const [updateLoading, setUpdateLoading] = useState(false);

    // State cho chỉnh sửa
    const [showEdit, setShowEdit] = useState(false);
    const [editRecord, setEditRecord] = useState({});
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                const response = await authApis().get(`/health-record?page=${page}`);
                if (response.status === 200) {
                    setRecords(response.data);
                } else {
                    setRecords([]);
                    setMessage("Không tìm thấy hồ sơ bệnh án.");
                }
            } catch (error) {
                setRecords([]);
                setMessage("Không tìm thấy hồ sơ bệnh án.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [page]);

    // Lấy danh sách lịch hẹn khi mở form chỉnh sửa
    const fetchAppointments = async (patientId) => {
        try {
            const res = await authApis().get(`/appointment?patientId=${patientId}`);
            if (res.status === 200) {
                setAppointments(res.data);
                console.log(res.data);
            }
            else setAppointments([]);
        } catch {
            setAppointments([]);
        }
    };

    const handleEdit = (record) => {
        setEditRecord(record);
        setShowEdit(true);
        fetchAppointments(user.userId);
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
        <div className="container mt-5">
            {loading ? (
                <MySpinner />
            ) : (
                <div>
                    <h3 className="mb-4 text-primary fw-bold">
                        <i className="bi bi-journal-medical me-2"></i>
                        Danh sách hồ sơ bệnh án
                    </h3>
                    {records.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            {message || "Chưa có hồ sơ bệnh án."}
                        </Alert>
                    ) : (
                        <div className="row g-4">
                            {records.map(record => (
                                <div key={record.id} className="col-md-6 col-lg-4">
                                    <div className="card shadow-sm border-0 h-100">
                                        <div className="card-body">
                                            <h5 className="card-title text-success">
                                                <i className="bi bi-file-earmark-medical me-2"></i>
                                                Mã hồ sơ: <span className="badge bg-secondary">{record.recordId}</span>
                                            </h5>
                                            <ul className="list-group list-group-flush mb-3">
                                                <li className="list-group-item">
                                                    <strong>Triệu chứng:</strong> {record.symptoms}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Lịch hẹn:</strong> {record.appointmentId && record.appointmentId.appointmentTime
                                                        ? new Date(record.appointmentId.appointmentTime).toLocaleString()
                                                        : <span className="text-danger">Chưa cập nhật</span>}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Chẩn đoán:</strong> {record.diagnosis || <span className="text-danger">Chưa cập nhật</span>}
                                                </li>

                                                <li className="list-group-item">
                                                    <strong>Toa thuốc:</strong> {record.prescription || <span className="text-danger">Chưa cập nhật</span>}
                                                </li>
                                                <li className="list-group-item">
                                                    <strong>Ghi chú:</strong> {record.notes || <span className="text-danger">Chưa cập nhật</span>}
                                                </li>
                                            </ul>
                                            < Button variant="outline-primary" size="sm" onClick={() => handleEdit(record)}>
                                                <i className="bi bi-pencil-square"></i> Chỉnh sửa
                                            </Button>



                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Label>Toa thuốc</Form.Label>
                                    <Form.Control
                                        name="prescription"
                                        value={editRecord?.prescription || "Chưa có cập nhật từ bác sĩ"}
                                        readOnly={user.role !== "Doctor"}
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
                </div>
            )
            }
        </div >
    );
};

export default HealthRecord;