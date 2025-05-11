import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authApis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContexts";
import cookie from 'react-cookies'
const EditProfile = () => {

    const thisUser = useContext(MyUserContext);
    const [userData, setUserData] = useState({
        email: thisUser?.email || "",
        firstName: thisUser?.firstName || "",
        lastName: thisUser?.lastName || "",
        phoneNumber: thisUser?.phoneNumber || "",
        address: thisUser?.address || "",
        dateOfBirth: thisUser?.dateOfBirth || "",
        gender: thisUser?.gender || "",
        avatar: thisUser?.avatar || null,
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleFileChange = (e) => {
        setUserData({ ...userData, avatar: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        const formData = new FormData();
        formData.append("email", userData.email);
        formData.append("firstName", userData.firstName);
        formData.append("lastName", userData.lastName);
        formData.append("phoneNumber", userData.phoneNumber);
        formData.append("address", userData.address);
        formData.append("dateOfBirth", userData.dateOfBirth);
        formData.append("gender", userData.gender);
        if (userData.avatar) {
            formData.append("avatar", userData.avatar);
        }

        try {
            const response = await authApis().patch(`user/${thisUser.username}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                navigate("/",{ state: { message: "Cập nhật thông tin thành công!" } }); // Chuyển hướng về trang chủ cho gọn
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Sửa Thông Tin Cá Nhân</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={userData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateOfBirth"
                                value={userData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Giới tính</Form.Label>
                            <Form.Select
                                name="gender"
                                value={userData.gender}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Ảnh đại diện</Form.Label>
                            <Form.Control
                                type="file"
                                name="avatar"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                {loading ? (<div className="text-center mb-3"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>
                ) : (
                    <div className="text-center">
                        <Button variant="primary" type="submit">
                            Lưu thay đổi
                        </Button>
                    </div>)}
            </Form>
        </Container>
    );
};

export default EditProfile;