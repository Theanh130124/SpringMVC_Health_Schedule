import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authApis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContexts";
import { MyDipatcherContext } from "../configs/MyContexts";
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const thisUser = useContext(MyUserContext);
    const dispatch = useContext(MyDipatcherContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("currentPassword", currentPassword);
            formData.append("newPassword", newPassword);

            const response = await authApis().patch(`user/change-password/${thisUser.username}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.success === true) {
                setMessage(response.data.message);
                dispatch({ type: "logout" });
                navigate("/login", { state: { message: "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!" } });
            }
            else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            setError(error.response?.data?.message || "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Thay Đổi Mật Khẩu</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6} className="offset-md-3">
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="text-center">
                            {loading ? (
                                <div className="text-center mb-3"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>
                            ) : (
                                <Button variant="primary" type="submit">
                                    Thay đổi mật khẩu
                                </Button>
                            )}

                        </div>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default ChangePassword;