import { useEffect, useState } from "react"
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Apis, { endpoint } from "../configs/Apis";
import { Link, useSearchParams } from "react-router-dom";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MySpinner from "./layout/MySpinner";
import RatingIcon from "../utils/RattingIcon";

const Finddoctor = () => {

    // Nhớ làm xem thêm
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(1);
    const [q, setQ] = useSearchParams();
    const [hasMore, setHasMore] = useState(true);

    const [keyword, setKeyword] = useState("");




    const handleKeywordChange = (e) => {
        let value = e.target.value;
        setKeyword(value);
        setQ({ keyword: value })

    }


    const loadDoctors = async () => {
        try {

            let keyword = q.get('keyword')
            if (!keyword || keyword.trim() === "") {
                setDoctors([]);
                return;
            }
            setLoading(true)

            let url = `${endpoint['doctor']}?page=${page}&keyword=${keyword}`;
            let res = await Apis.get(url);

            if (page === 1) {
                setDoctors(res.data);
            }
            else {
                setDoctors(prev => [...prev, ...res.data]);
            }
            if (res.data.length < 8) {
                setHasMore(false);
            }

        } catch (ex) {
            console.error(ex);
        }
        finally {
            setLoading(false)
        }

    }



    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setDoctors([]);

    }, [q]);


    useEffect(() => {
        loadDoctors();
    }, [page, q])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="justify-content-center g-4 custom-row mt-5 search-bar">
                    <Col xs={12} className="text-center">
                        <h2 className="search-title">
                            <i className="bi bi-search-heart me-2 search-icon"></i> Tìm kiếm bác sĩ
                        </h2>
                        <p className="search-subtitle">Nhập tên bác sĩ, chuyên khoa hoặc phòng khám để tìm kiếm</p>
                    </Col>
                    <Col md={6} lg={6} xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="Tìm bác sĩ, chuyên khoa hoặc phòng khám..."
                            value={keyword}
                            className="search-input rounded-pill shadow-sm"
                            onChange={handleKeywordChange}
                        />
                    </Col>
                </Row>


                <Row className="justify-content-center g-4  mt-4">

                    {loading && !q.get('keyword') && (
                        <div className="text-center mt-4">
                            <MySpinner />
                        </div>
                    )}
                    {doctors.length === 0 && <Alert variant="info" className="m-2 text-center">Không tìm thấy bác sĩ nào!</Alert>}
                    {doctors.map(d => (
                        <Col key={d.doctorId} xs={12} sm={6} md={4} lg={3} >
                            <Card className="card-doctor shadow-sm">
                                <Card.Img variant="top" src={d.userDTO.avatar}  />
                                <Card.Body className="card-body-custom">
                                    <div>
                                        <Card.Title className="card-title"> Bác sĩ : {`${d.userDTO.firstName} ${d.userDTO.lastName}`.split(' ').slice(0, 4).join(' ')}
                                            {`${d.userDTO.firstName} ${d.userDTO.lastName}`.split(' ').length > 4 && '...'}</Card.Title>

                                        {/*  */}

                                        {d.specialties.map(s => (<Card.Text key={s.specialtyId} className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Chuyên khoa:</strong> {s.name}
                                        </Card.Text>))}



                                        {d.clinics.map(c => (<Card.Text key={c.clinicId} className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Bệnh viên : </strong>{c.name} <br />
                                            <strong>Địa chỉ: </strong>{c.address}
                                        </Card.Text>
                                        ))}
                                        <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Đánh giá :</strong> {d.averageRating} <RatingIcon rating={d.averageRating} />
                                        </Card.Text>

                                        <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Phí khám:</strong>  {d.consultationFee.toLocaleString('vi-VN')} VNĐ
                                        </Card.Text>




                                    </div>
                                    <div className="d-grid gap-1 mt-2">
                                        {/* Xem lịch trống là tìm lịch trống theo id doctor đó */}
                                        <Button variant="primary" as={Link} to="/calendar" size="sm">Xem lịch trống</Button>
                                        <Button variant="danger" as={Link} to="/review" size="sm">Xem đánh giá</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>


                    ))}
                </Row>



                {/* Xem thêm */}

                <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                    {hasMore && doctors.length > 0 && !loading && (
                        <Col md={1} lg={1} xs={1}>
                            <Button variant="info" onClick={() => setPage(prev => prev + 1)} > Xem thêm</Button>
                        </Col>
                    )}
                </Row>
                <Row className="g-4 mb-4 mt-4"></Row>

            </Container>
        </>
    );
};

export default Finddoctor