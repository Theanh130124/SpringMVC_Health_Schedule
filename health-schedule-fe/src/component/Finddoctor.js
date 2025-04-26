import { useEffect, useState } from "react"
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Apis, { endpoint } from "../configs/Apis";
import { Link, useSearchParams } from "react-router-dom";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MySpinner from "./layout/MySpinner";

const Finddoctor = () => {


    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useSearchParams();

    const [keyword, setKeyword] = useState("");




    const handleKeywordChange = (e) => {
        let value = e.target.value;
        setKeyword(value);
        setQ({ keyword: value })

    }


    const loadDoctors = async () => {
        try {

            let keyword = q.get('keyword')
            //Chưa tìm chưa load
            if (!keyword || keyword.trim() === "") {
                setDoctors([]);
                return;
            }
            setLoading(true)

            let url = `${endpoint['doctor']}?page=${page}&keyword=${keyword}`;
            let res = await Apis.get(url);


            setDoctors(res.data);

        } catch (ex) {
            console.error(ex);
        }
        finally {
            setLoading(false)
        }

    }



    useEffect(() => {
        loadDoctors();
    }, [page, q])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="justify-content-center g-4 custom-row mt-5">
                    <Col md={6} lg={6} xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="Tìm bác sĩ, chuyên khoa hoặc phòng khám..."
                            value={keyword}
                            className="search-input"
                            onChange={handleKeywordChange}

                        />

                    </Col>
                </Row>

                {/* CSS cho đều lại card */}
                <Row className="justify-content-center g-4  mt-4">
                    {doctors.length === 0 && <Alert variant="info" className="m-2 text-center">Không tìm thấy bác sĩ nào!</Alert>}
                    {doctors.map(d => (
                        <Col key={d.doctorId} xs={12} sm={6} md={4} lg={3} >
                            <Card className="card-doctor shadow-sm">
                                <Card.Img variant="top" src={d.user.avatar} className="card-img-top " />
                                <Card.Body className="card-body-custom">
                                    <div>
                                        <Card.Title className="card-title">{`${d.user.firstName} ${d.user.lastName}`.split(' ').slice(0, 4).join(' ')}
                                            {`${d.user.firstName} ${d.user.lastName}`.split(' ').length > 4 && '...'}</Card.Title>
                                        <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        {d.bio ? (d.bio.length > 50 ? d.bio.slice(0, 50) + "..." : d.bio) : "Không có mô tả"}
                                        </Card.Text>
                                    </div>
                                    <div className="d-grid gap-1 mt-2">
                                        <Button variant="primary" as={Link} to="/calendar" size="sm">Xem lịch trống</Button>
                                        <Button variant="danger" size="sm">Xem đánh giá</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>


                    ))}
                </Row>

                {loading && !q.get('keyword') && (
                    <div className="text-center mt-4">
                        <MySpinner />
                    </div>
                )}
            </Container>
        </>
    );
};

export default Finddoctor