import { useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap"
import Apis, { endpoint } from "../configs/Apis";
import cookie from 'react-cookies'
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";

const Login = () => {
    //Phải là đối tượng rỗng
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const info = [
        { label: "Tên đăng nhập", field: "username", type: "text" },
        { label: "Mật khẩu", field: "password", type: "password" },

    ]


    const login = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                let res = await Apis.post(endpoint['login'],{
                    ...user}
                );
                cookie.save('token', res.data.token);
                let u = await Apis.get(endpoint['current_user']);
                console.info(u.data);

                console.info(res.data);


                nav('/'); //Về trang chủ
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }



        }
        process();
    }

    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }

    return (

        <Container fluid className="p-0">
            <Row className="justify-content-center custom-row-primary mt-4">
                <Col lg={6} md={4} sm={12} >
                    <h1 className="text-center text-success mb-4">ĐĂNG NHẬP</h1>
                    <Form onSubmit={login}>

                    {/* required: Bắt buộc phải nhập trước khi submit. value theo từng field onChange set dữ liệu mới*/}
                        {info.map(f => <FloatingLabel key={f.field} controlId="floatingInput" label={f.label} className="mb-3">
                            <Form.Control type={f.type} placeholder={f.label} required value={user[f.field]} onChange={e => setState(e.target.value, f.field)} />
                        </FloatingLabel>)}
                        {loading ? <MySpinner /> : <Button type="submit" variant="success" className="mt-1 mb-1">Đăng nhập</Button>}
                    </Form>
                </Col>
            </Row>
        </Container>

    )
}


export default Login;