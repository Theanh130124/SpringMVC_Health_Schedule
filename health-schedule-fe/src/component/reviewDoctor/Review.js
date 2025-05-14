
import axios from "axios"
import { use, useContext, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Apis, { endpoint } from "../../configs/Apis"
import { Container, Row, Col, Card, Image, Spinner, Button, Form } from "react-bootstrap";
import { MyDoctorContext } from "../../configs/MyContexts";
import RatingIcon from "../../utils/RattingIcon";
import "./StylesComment/Comment.css"
import { authApis } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";
import MyConfigs from "../../configs/MyConfigs";
const Review = () => {

    const [q] = useSearchParams();//dung de lay param tren url
    const [reviews, setReviews] = useState([]);//Danh sach danh gia
    const [loading, setLoading] = useState(true);//Loading danh sach danh gia
    const [page, setPage] = useState(1);//Trang hien tai
    const [doctor, setDoctor] = useState({});//Bac si theo id khi nguoi dung click vao

    const [editedResponses, setEditedResponses] = useState({});//Danh sach cac phan hoi
    const [isEditing, setIsEditing] = useState(null);//Kiem tra dang chinh sua hay khong
    const user = useContext(MyUserContext);//Lay user tu context
    const [updateLoading, setUpdateLoading] = useState(false)//Loading khi cap nhat phan hoi
    const [doctors, setDoctors] = useState([]) //Danh sach bac si

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString("vi-VN");
    }

    useEffect(() => {

        const fetchDoctor = async () => {//Lay bac si theo id
            try {
                let doctorId = q.get('doctorId');
                if (doctorId) {
                    const res = await Apis.get(`${endpoint['doctor']}/${doctorId}`);
                    setDoctor(res.data);
                }
            } catch (error) {
                console.error("Không thể lấy dữ liệu bác sĩ: ", error);
            }
        };

        fetchDoctor();
    }, [q])//Fetch bac si khi id thay doi

    useEffect(() => {
        const fetchReviewsOrDoctors = async () => {
            setLoading(true);
            try {
                let doctorId = q.get('doctorId');
                if (doctorId) {//Neu co truyen doctorId thi lay danh sach danh gia
                    await fetchReviews(doctorId);
                } else {
                    await fetchDoctors();//Khong thi lay danh sach bac si
                }
            } catch (error) {
                console.error("Không thể lấy dữ liệu: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (page > 0) {//Neu trang > 0 thi lay danh sach danh gia hoac bac si
            fetchReviewsOrDoctors();
        }
    }, [q, page]);//Fetch danh sach danh gia hoac bac si khi trang thay doi

    const fetchReviews = async (doctorId) => {
        const res = await Apis.get(`${endpoint['reviews']}/${doctorId}?page=${page}`);
        if (res.data.length < MyConfigs.PAGE_SIZE) setPage(0);//Neu khong con danh gia thi set page = 0 de khong load nua
        setReviews(prev => page === 1 ? res.data : [...prev, ...res.data]);
    };

    const fetchDoctors = async () => {
        const res = await Apis.get(`${endpoint['doctor']}?page=${page}`);
        if (res.data.length < MyConfigs.PAGE_SIZE) setPage(0);
        setDoctors(prev => page === 1 ? res.data : [...prev, ...res.data]);
    };

    const handleReplyChange = (reviewId, text) => {
        setEditedResponses(prev => ({
            ...prev,
            [reviewId]: text
        }));
    };

    const handleSaveResponse = async (reviewId) => {
        const text = editedResponses[reviewId];
        setUpdateLoading(true)
        try {
            let url = `${endpoint['review']}/${reviewId}`
            console.log(url)
            console.log(user)
            await authApis().patch(url, {
                doctorResponse: text
            });

            setReviews(prevReviews =>
                prevReviews.map(r =>
                    r.reviewId === reviewId
                        ? {
                            ...r,
                            doctorResponse: text,
                            responseDate: Date.now() // Cập nhật ngày trả lời
                        }
                        : r
                )
            );


        } catch (error) {
            console.log("Khong the cap nhat binh luan: ", error)
        }
        finally {
            setIsEditing(null);
            setUpdateLoading(false)
        }

    };

    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    }

    useEffect(() => {
        setPage(1)
        setReviews([])
        setDoctors([])

    }, [q])

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Đang tải...</p>
                </div>
            ) : q.get("doctorId") === null ? (
                <Row>
                    {Array.isArray(doctors) && doctors.map(d => (
                        <Col key={d.doctorId} md={4} className="mb-4">
                            <Card className="card-doctor">
                                <Card.Img src={d.userDTO.avatar} alt={`${d.userDTO.firstName} ${d.userDTO.lastName}`} />
                                <Card.Body>
                                    <Card.Title>{d.userDTO.firstName} {d.userDTO.lastName}</Card.Title>
                                    <Card.Text>
                                        <strong>Chuyên khoa:</strong> {d.specialties.map(s => s.name).join(", ")}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Đánh giá:</strong> {d.averageRating} <RatingIcon rating={d.averageRating} />
                                    </Card.Text>
                                    <Button variant="primary" as={Link} to={`/review/?doctorId=${d.doctorId}`}>Xem đánh giá</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Container className="mt-4">
                    <Row className="justify-content-center">
                        <Col md={3} sm={10}>
                            {doctor && doctor.user ? (
                                <Card className="shadow-sm rounded-4 border-0" style={{ background: "#f5f9ff", fontSize: "0.9rem" }}>
                                    <Card.Img
                                        variant="top"
                                        src={doctor.user.avatar}
                                        className="rounded-top"
                                        style={{ objectFit: "cover", height: "140px" }}
                                    />
                                    <Card.Body className="p-2">
                                        <Card.Title className="text-primary fs-6 fw-bold mb-2">
                                            {doctor.user.firstName} {doctor.user.lastName}
                                        </Card.Title>

                                        <Card.Text className="mb-1">
                                            <i className="bi bi-star-fill text-warning me-1"></i>
                                            <strong>Đánh giá:</strong> {doctor.averageRating} <RatingIcon rating={doctor.averageRating} />
                                        </Card.Text>

                                        <Card.Text className="mb-0">
                                            <i className="bi bi-award text-danger me-1"></i>
                                            <strong>Nổi bật:</strong> {doctor.bio}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <div className="text-center">
                                    <Spinner animation="border" />
                                    <p>Đang tải thông tin bác sĩ...</p>
                                </div>
                            )}
                        </Col>
                    </Row>

                    {/* Danh sách đánh giá */}
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                            <p>Đang tải đánh giá...</p>
                        </div>
                    ) : (
                        <section className="comment-section py-5">
                            <Container>
                                <Row className="justify-content-center">
                                    <Col md={8}>
                                        <h4 className="text-center mb-4">Hỏi đáp bác sĩ</h4>
                                        {reviews.length ? (
                                            reviews
                                                .slice()
                                                .sort((a, b) => {
                                                    // Đưa comment của bạn lên đầu
                                                    if (user && user.userId === a.patientId.user.userId) return -1;
                                                    if (user && user.userId === b.patientId.user.userId) return 1;
                                                    return 0;
                                                }).map((r) => (
                                                    <Card key={r.reviewId} className="card-comment mb-3 p-3">
                                                        <div className="d-flex">
                                                            <Image
                                                                src={r.patientId.user.avatar || "/default-avatar.png"}
                                                                roundedCircle
                                                                width={50}
                                                                height={50}
                                                                className="me-3 review-avatar"
                                                            />
                                                            <div>
                                                                <h6 className="review-header">
                                                                    <strong>
                                                                        {user && user.userId === r.patientId.user.userId
                                                                            ? "Bạn"
                                                                            : `${r.patientId.user.firstName} ${r.patientId.user.lastName}`
                                                                        }
                                                                    </strong>
                                                                    <span className="review-date">- {formatDate(r.reviewDate)}</span>
                                                                </h6>
                                                                <p className="comment-content mb-2">{r.comment}</p>

                                                                <div className="mt-3">
                                                                    {isEditing === r.reviewId ? (
                                                                        <Form.Group controlId={`doctorResponse-${r.reviewId}`}>
                                                                            <Form.Control
                                                                                as="textarea"
                                                                                rows={3}
                                                                                value={editedResponses[r.reviewId] || ""}
                                                                                onChange={(e) => handleReplyChange(r.reviewId, e.target.value)}
                                                                            />
                                                                            {updateLoading ? (
                                                                                <div className="spinner-container">
                                                                                    <Spinner animation="border" />
                                                                                    <p>Đang cập nhật...</p>
                                                                                </div>
                                                                            ) : (
                                                                                <Button variant="primary" onClick={() => handleSaveResponse(r.reviewId)}>Save</Button>
                                                                            )}
                                                                            <Button variant="secondary" onClick={() => setIsEditing(null)}>Cancel</Button>
                                                                        </Form.Group>
                                                                    ) : (
                                                                        r.doctorResponse ? (
                                                                            <div className="reply-box">
                                                                                <div className="d-flex">
                                                                                    <Image
                                                                                        src={doctor.user.avatar}
                                                                                        roundedCircle
                                                                                        width={40}
                                                                                        height={40}
                                                                                        className="me-2"
                                                                                    />
                                                                                    <div>
                                                                                        <h6 className="text-primary">
                                                                                            Bác sĩ{" "} {doctor.user.firstName} {doctor.user.lastName}{" "}
                                                                                            <span className="text-muted small">
                                                                                                - {formatDate(r.responseDate)}
                                                                                            </span>
                                                                                        </h6>
                                                                                        <p className="small">{r.doctorResponse}</p>
                                                                                        {user && user.userId === doctor.user.id && (
                                                                                            <Button
                                                                                                variant="link"
                                                                                                onClick={() => {
                                                                                                    setIsEditing(r.reviewId);
                                                                                                    setEditedResponses(prev => ({
                                                                                                        ...prev,
                                                                                                        [r.reviewId]: r.doctorResponse
                                                                                                    }));
                                                                                                }}
                                                                                            >
                                                                                                Chỉnh sửa
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            user && user.userId === doctor.user.id && (
                                                                                <Button
                                                                                    variant="link"
                                                                                    onClick={() => {
                                                                                        setIsEditing(r.reviewId);
                                                                                        setEditedResponses(prev => ({
                                                                                            ...prev,
                                                                                            [r.reviewId]: ""
                                                                                        }));
                                                                                    }}
                                                                                >
                                                                                    Phản hồi
                                                                                </Button>
                                                                            )
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                ))
                                        ) : (
                                            <div>Chưa có đánh giá nào!</div>
                                        )}
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    )}
                </Container>
            )}

            {/* Nút "Xem thêm" */}
            <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {page > 0 && (
                    <Col md={1} lg={1} xs={1}>
                        <Button variant="info" onClick={loadMore}>Xem thêm</Button>
                    </Col>
                )}
            </Row>
            <Row className="g-4 mb-4 mt-4"></Row>
        </>
    );

}

export default Review
