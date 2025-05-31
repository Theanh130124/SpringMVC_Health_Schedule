import { use, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { authApis } from "../configs/Apis";
import { FaStar } from "react-icons/fa";
import "./Styles/DoctorReview.css";
import { useEffect } from "react";

const DoctorReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const doctor = location.state?.doctor || {};
    const appointmentId = location.state?.appointmentId || null
    const patientId = location.state?.patientId || null
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //Chặn lại nếu người dùng paste đường dẫn vào khi không có doctor, appointment, patient
    useEffect(() => {
        if (!doctor || !patientId || !appointmentId) {
            navigate("/", { state: { message: "Không thể viết đánh giá" } });
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = new FormData();
            data.append("appointmentId", appointmentId);
            data.append("rating", rating);
            data.append("comment", comment);
            const res = await authApis().post(`/review`, data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (res.status === 200 || res.status === 201) {
                setMessage("Đánh giá thành công!");
                setTimeout(() => navigate("/appointment", { state: { message: "Đánh giá thành công!" } }), 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={7} lg={6}>
                    <div className="doctor-review-card shadow p-4 rounded bg-white">
                        <h2 className="mb-3 text-center text-primary">Đánh giá bác sĩ</h2>
                        <div className="text-center mb-3">
                            <img
                                src={doctor.user?.avatar}
                                alt="avatar"
                                className="rounded-circle"
                                width={80}
                                height={80}
                                style={{ objectFit: "cover", border: "2px solid #0d6efd" }}
                            />
                            <div className="mt-2 fw-bold">
                                {doctor.user?.firstName} {doctor.user?.lastName}
                            </div>
                        </div>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 text-center">
                                <Form.Label className="fw-bold">Chọn số sao</Form.Label>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={32}
                                            style={{ cursor: "pointer", marginRight: 4 }}
                                            color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(null)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Nhận xét của bạn</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Nhập nhận xét về bác sĩ..."
                                    required
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default DoctorReview;