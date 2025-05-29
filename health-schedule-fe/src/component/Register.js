import { useEffect, useRef, useState } from "react";
// FloatingLabel form nhập vào thì placeholder sẽ lên trên
import { Alert, Button, Col, Container, FloatingLabel, Form, Image, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Apis, { endpoint } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import toast from "react-hot-toast";

const Register = () => {



    const info = [
        { title: "Họ và tên lót", field: "lastName", type: "text" },
        { title: "Tên", field: "firstName", type: "text" },
        { title: "Tên đăng nhập", field: "username", type: "text" },
        { title: "Mật khẩu", field: "password", type: "password" },
        { title: "Xác nhận mật khẩu", field: "confirm", type: "password" },
        { title: "Địa chỉ Email", field: "email", type: "email" },
        { title: "Số điện thoại", field: "phone", type: "text" },
        { title: "Địa chỉ", field: "address", type: "text" },
        {
            title: "Giới tính", field: "gender", type: "select", options: [
                { label: "Nam", value: "Male" },
                { label: "Nữ", value: "Female" }
            ]
        },
        { title: "Ngày sinh", field: "birthday", type: "date" },
        { title: "Lịch sử bệnh", field: "medicalHistory", type: "text" },
    ];




    const [user, setUser] = useState({});
    const avatar = useRef();
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const nav = useNavigate();
    // const formRef = useRef(); // -> tham chiếu tới Form để các thành phần này đều như 1 form



    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }



    const register = async (e) => {
        e.preventDefault();
        // Đảm bảo luôn có role trước khi submit
        const userData = { ...user};

        if (!userData.role) {
            userData.role = "Patient";
        }

        if (userData.password !== userData.confirm) {
            setMsg("Mật khẩu không khớp");
            return;
        }



        let form = new FormData();
        for (let key in userData) {
            if (key !== 'confirm')
                form.append(key, userData[key]);
        }
        if (avatar.current && avatar.current.files && avatar.current.files.length > 0) {
            form.append("avatar", avatar.current.files[0]);
        }

        try {
            setLoading(true);
            await Apis.post(endpoint['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            nav("/login"); // đk thành công về đăng nhập
            toast.success("Đăng ký tài khoản thành công")
        } catch (ex) {
            console.error(ex);
            setMsg(`Đã có lỗi xảy ra ${ex}`);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        if (msg) {
            const timer = setTimeout(() => {
                setMsg(null);
            }, 5000); // Thời gian hiển thị 5 giây

            return () => clearTimeout(timer);
        }
    }, [msg]);
    return (
        <>
            {/* Check validate -> làm thêm con mắt xem pass */}
            <Container fluid className="p-0">
                <Row className="justify-content-center custom-row-primary mt-4">
                    <Col lg={6} md={4} sm={12} >
                        <Image src="/assets/images/login-banner.png" alt="banner" className="mt-5 ms-3" />
                        <p className="text-center mt-3 text-muted me-5" style={{ fontSize: "1.5rem", color: "#007bff", fontWeight: "bold" }}>" Đội ngũ bác sĩ tận tâm với bệnh nhân, luôn sẵn sàng hỗ trợ bạn trong hành trình chăm sóc sức khỏe."</p>

                    </Col>
                    <Col lg={5} md={6} sm={12}>
                        <Container className="p-3 shadow rounded bg-light me-5">
                            <h1 className="text-center text-success mb-4">ĐĂNG KÝ</h1>
                            {msg && <Alert variant="danger">{msg}</Alert>}
                            <Form onSubmit={register}>
                                <Row>
                                    {/* Cột đầu tiên */}
                                    <Col lg={6} md={6} sm={12}>
                                        {info.slice(0, Math.ceil(info.length / 2)).map((i, index) => (
                                            <div key={i.field} className="mb-3">
                                                {i.type === "select" ? (
                                                    <Form.Select value={user[i.field] || ''} required
                                                        onChange={e => setState(e.target.value, i.field)}>
                                                        <option value="">-- {i.title} --</option>
                                                        {i.options.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <FloatingLabel controlId={`floating-${i.field}`} label={i.title}>
                                                        <Form.Control type={i.type} placeholder={i.title} required
                                                            value={user[i.field] || ''} onChange={e => setState(e.target.value, i.field)} />
                                                    </FloatingLabel>
                                                )}
                                            </div>
                                        ))}
                                    </Col>

                                    {/* Cột thứ hai */}
                                    <Col lg={6} md={6} sm={12}>
                                        {info.slice(Math.ceil(info.length / 2)).map((i, index) => (
                                            <div key={i.field} className="mb-3">
                                                {i.type === "select" ? (
                                                    <Form.Select value={user[i.field] || ''} required
                                                        onChange={e => setState(e.target.value, i.field)}>
                                                        <option value="">-- {i.title} --</option>
                                                        {i.options.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) : (
                                                    <FloatingLabel controlId={`floating-${i.field}`} label={i.title}>
                                                        <Form.Control type={i.type} placeholder={i.title} required
                                                            value={user[i.field] || ''} onChange={e => setState(e.target.value, i.field)} />
                                                    </FloatingLabel>
                                                )}
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12} className="mb-3">
                                        <Form.Control ref={avatar} type="file" placeholder="Ảnh đại diện" />
                                    </Col>
                                </Row>
                                <Button type="submit" variant="success" className="mt-3 w-100" disabled={loading}>
                                    {loading ? <MySpinner /> : "Đăng ký"}
                                </Button>
                            </Form>
                        </Container>
                    </Col>


                </Row>
            </Container>
        </>
    )
}

export default Register