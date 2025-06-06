import { useContext, useState, useEffect } from "react";
import { Alert, Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap"
import Apis, { authApis, endpoint } from "../configs/Apis";
import cookie from 'react-cookies'
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";
import { MyDipatcherContext } from "../configs/MyContexts";
import toast from "react-hot-toast";
import { showCustomToast } from "./layout/MyToaster";
import { useLocation } from "react-router-dom";
import "./Styles/Login.css";

const Login = () => {
    //Phải là đối tượng rỗng
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState();
    const dispatch = useContext(MyDipatcherContext);
    const nav = useNavigate();

    const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || "");

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const info = [
        { label: "Tên đăng nhập", field: "username", type: "text" },
        { label: "Mật khẩu", field: "password", type: "password" },

    ]

    //Cập nhật value vào field vào user 
    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }

    const login = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMsg(null);
            let res = await Apis.post(endpoint['login'], {
                ...user
            });

            cookie.save('token', res.data.token);

            let u = await authApis().get(endpoint['current_user']);

            console.info(u.data);



            //Cung cấp chứng chỉ

            if (u.data.role === "Doctor" && !u.data.isActive) {
                sessionStorage.setItem("doctorId", u.data.userId); // không lưu user vì sẽ hiện header 
                showCustomToast("Tài khoản chưa được kích hoạt. Vui lòng cung cấp chứng chỉ hành nghề cho admin để kích hoạt tài khoản!");
                nav("/uploadLicense");
                return;

            }

            //Luu lai cookie chỉ khi bác sĩ đã  đc duyệt 
            cookie.save('user', u.data);

            //bác sĩ chưa đăng nhập không lưu context
            dispatch({
                "type": "login",
                "payload": u.data
            });
            toast.success("Đăng nhập thành công!");
            nav("/");
        } catch (ex) {
            console.error("Lỗi đăng nhập:", ex);

            if (ex.response && ex.response.status === 401) {
                // Lỗi 401: Thông tin đăng nhập không hợp lệ
                setMsg("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!");
            } else {
                // Lỗi khác
                setMsg("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        } finally {
            setLoading(false);
        }
    }



    return (

        <Container fluid className="p-0">
            {message && (
                <div className="fade-out-message">
                    {message}
                </div>
            )}
            <Row className="justify-content-center custom-row-primary mt-4">
                <Col lg={6} md={4} sm={12} >
                    <h1 className="text-center text-success mb-4">ĐĂNG NHẬP</h1>
                    {msg && <Alert variant="danger">{msg}</Alert>}
                    <Form onSubmit={login}>

                        {/* required: Bắt buộc phải nhập trước khi submit. value theo từng field onChange set dữ liệu mới*/}
                        {info.map(f => <FloatingLabel key={f.field} controlId="floatingInput" label={f.label} className="mb-3">
                            <Form.Control type={f.type} placeholder={f.label} required vvalue={user[f.field] || ""}
                                onChange={e => setState(e.target.value, f.field)} />
                        </FloatingLabel>)}
                        {loading === true ? <MySpinner /> : <Button type="submit" variant="success" className="mt-1 mb-1">Đăng nhập</Button>}
                    </Form>
                </Col>
            </Row>
        </Container>

    )

}

export default Login;