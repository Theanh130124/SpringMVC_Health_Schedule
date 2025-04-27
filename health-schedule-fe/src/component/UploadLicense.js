import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Apis, { authApis, endpoint } from "../configs/Apis";
import { Alert, Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import cookie from 'react-cookies'

const UploadLicense = () => {
// Nên thêm hình ảnh chứng chỉ
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [license, setLicense] = useState({});
    const nav = useNavigate();


    //Lấy id trong sessionStorage
    const doctorId = sessionStorage.getItem("doctorId");

    const info = [
        { label: "Số chứng chỉ hành nghề", field: "licenseNumber", type: "text" },
        { label: "Ngày cấp", field: "issuedDate", type: "date" },
        { label: "Ngày hết hạn", field: "expiryDate", type: "date" },
        { label: "Cơ quan cấp", field: "issuingAuthority", type: "text" },
        { label: "Chuyên môn làm việc", field: "scopeDescription", type: "text" },
    ]


    const setState = (value, field) => {

        setLicense({ ...license, [field]: value })
    }

    //Thêm thông báo 
    const upload = async (e) => {
        e.preventDefault();
        try {
            //Bên kia đã lưu token vào cookie
            setLoading(true);
            let res = await authApis().post(endpoint['doctor_license']
                , {

                    ...license,
                    "doctorId": doctorId
                }
            );
            setMsg("Chứng chỉ hành nghề đã gửi thành công , vui lòng chờ duyệt!");
            sessionStorage.removeItem("doctorId");
            cookie.remove('token');
            nav("/login");
        } catch (ex) {

            console.error(ex);
            setMsg(`Có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
        }
        finally {
            setLoading(false);
        }
    }

    // Gửi 1 lần rồi phải chờ duyệt
    return (
        <Container fluid className="p-0">
            <Row className="justify-content-center custom-row-primary mt-4">
                <Col lg={6} md={4} sm={12} >
                    <h1 className="text-center text-success mb-4">CUNG CẤP CHỨNG CHỈ HÀNH NGHỀ</h1>
                    {msg && <Alert variant="danger">{msg}</Alert>}
                    <Form onSubmit={upload}>
                        {info.map(l => <FloatingLabel key={l.field} label={l.label} className="mb-3">

                            <Form.Control type={l.type} placeholder={l.label} required value={license[l.field]} 
                            onChange={e => setState(e.target.value ,l.field)}/>

                        </FloatingLabel>)}
                        {loading ===true ? <MySpinner /> : <Button type="submit" className="btn btn-success mt-1 mb-1">Gửi chứng chỉ</Button>}


                    </Form>
                </Col>
            </Row>
        </Container>
    )
};
export default UploadLicense;