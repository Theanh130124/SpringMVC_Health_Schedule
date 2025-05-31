
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
        try {
            const res = await Apis.get(`${endpoint['reviews']}/${doctorId}?page=${page}&size=${MyConfigs.PAGE_SIZE}`);

            // Kiểm tra nếu là trang cuối
            const isLastPage = res.data.length < MyConfigs.PAGE_SIZE;

            // Cập nhật reviews
            setReviews(prev => {
                if (page === 1) return res.data;
                return [...prev, ...res.data];
            });

            // Chỉ set page = 0 khi không còn dữ liệu mới
            if (isLastPage) {
                setPage(0);
            }

        } catch (error) {
            console.error("Lỗi khi tải reviews:", error);
        }
    };

    // Tương tự cho fetchDoctors
    const fetchDoctors = async () => {
        try {
            const res = await Apis.get(`${endpoint['doctor']}?page=${page}&size=${MyConfigs.PAGE_SIZE}`);

            const isLastPage = res.data.length < MyConfigs.PAGE_SIZE;

            setDoctors(prev => {
                if (page === 1) return res.data;
                return [...prev, ...res.data];
            });

            if (isLastPage) {
                setPage(0);
            }

        } catch (error) {
            console.error("Lỗi khi tải danh sách bác sĩ:", error);
        }
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

    useEffect(() => {
        console.log(("a+"), doctor);

    }, [doctor])

    return (
        <>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Đang tải...</p>
                </div>
            ) : q.get("doctorId") === null ? (
                <Container className="mt-4">
                    <Row>
                        {Array.isArray(doctors) && doctors.map(d => (
                            <Col key={d.doctorId} md={4} lg={3} className="mb-3">
                                <Card className="card-doctor shadow-sm">
                                    <Card.Img variant="top" src={d.userDTO.avatar} />

                                    <Card.Body className="card-body-custom">
                                        <Card.Title className="card-title">{d.userDTO.firstName} {d.userDTO.lastName}</Card.Title>
                                        <Card.Text className="card-text">
                                            <strong>Chuyên khoa:</strong> {d.specialties.map(s => s.name).join(", ")}
                                        </Card.Text>
                                        <Card.Text className="card-text">
                                            <strong>Đánh giá:</strong> {d.averageRating} <RatingIcon rating={d.averageRating} />
                                        </Card.Text>
                                        <Button variant="primary" as={Link} to={`/review/?doctorId=${d.doctorId}`}>Xem đánh giá</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            ) : (
                <Container className="mt-3">
                    <Row className="justify-content-center">
                        <Col md={3} sm={10}>
                            {doctor && doctor.user ? (
                                <Card className="card-doctor shadow-sm" style={{ background: "#f5f9ff", fontSize: "0.9rem" }}>

                                    <Card.Img variant="top" src={doctor.user.avatar} />
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
                        <section className="py-4">
                            <Container>
                                <Row className="justify-content-center">
                                    <Col md={8}>
                                        <h4 className="text-center mb-4 fw-bold text-primary">Hỏi đáp bác sĩ</h4>
                                        {reviews.length ? (
                                            reviews
                                                .slice()
                                                .sort((a, b) => {
                                                    if (user && user.userId === a.patientId.user.userId) return -1;
                                                    if (user && user.userId === b.patientId.user.userId) return 1;
                                                    return 0;
                                                }).map((r) => (
                                                    <Card key={r.reviewId} className="shadow-sm rounded-4 border-0 mb-4">
                                                        <Card.Body className="p-4">
                                                            <div className="d-flex">
                                                                <Image
                                                                    src={r.patientId.user.avatar || "/default-avatar.png"}
                                                                    roundedCircle
                                                                    width={60}
                                                                    height={60}
                                                                    className="me-3"
                                                                    style={{ objectFit: "cover" }}
                                                                />
                                                                <div className="w-100">
                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                        <h6 className="fw-bold text-primary mb-0">
                                                                            {user && user.userId === r.patientId.user.userId
                                                                                ? "Bạn"
                                                                                : `${r.patientId.user.firstName} ${r.patientId.user.lastName}`
                                                                            }
                                                                            <span className="text-muted fw-normal ms-2 small">
                                                                                {formatDate(r.reviewDate)}
                                                                            </span>
                                                                        </h6>
                                                                    </div>

                                                                    <div className="d-flex align-items-center mb-2">
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <i
                                                                                key={index}
                                                                                className={`bi bi-star${index < r.rating ? "-fill" : ""} text-warning`}
                                                                            />
                                                                        ))}
                                                                    </div>

                                                                    <p className="text-secondary mb-3">{r.comment}</p>

                                                                    {/* Phần phản hồi */}
                                                                    <div className="mt-3">
                                                                        {isEditing === r.reviewId ? (
                                                                            <div className="reply-form bg-light rounded-3 p-3 border">
                                                                                <Form.Group>
                                                                                    <Form.Label className="fw-bold text-primary mb-2">
                                                                                        {r.doctorResponse ? "Chỉnh sửa phản hồi" : "Thêm phản hồi"}
                                                                                    </Form.Label>
                                                                                    <Form.Control
                                                                                        as="textarea"
                                                                                        rows={3}
                                                                                        value={editedResponses[r.reviewId] || ""}
                                                                                        onChange={(e) => handleReplyChange(r.reviewId, e.target.value)}
                                                                                        className="mb-3"
                                                                                        placeholder="Nhập nội dung phản hồi..."
                                                                                    />
                                                                                    <div className="d-flex gap-2 justify-content-end">
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="light"
                                                                                            onClick={() => setIsEditing(null)}
                                                                                            disabled={updateLoading}
                                                                                        >
                                                                                            <i className="bi bi-x-lg me-1"></i>
                                                                                            Hủy
                                                                                        </Button>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="primary"
                                                                                            onClick={() => handleSaveResponse(r.reviewId)}
                                                                                            disabled={updateLoading}
                                                                                        >
                                                                                            {updateLoading ? (
                                                                                                <>
                                                                                                    <Spinner
                                                                                                        as="span"
                                                                                                        animation="border"
                                                                                                        size="sm"
                                                                                                        role="status"
                                                                                                        aria-hidden="true"
                                                                                                        className="me-1"
                                                                                                    />
                                                                                                    Đang lưu...
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <i className="bi bi-check-lg me-1"></i>
                                                                                                    Lưu
                                                                                                </>
                                                                                            )}
                                                                                        </Button>
                                                                                    </div>
                                                                                </Form.Group>
                                                                            </div>
                                                                        ) : (
                                                                            r.doctorResponse ? (
                                                                                <div className="doctor-response bg-light rounded-3 p-3">
                                                                                    <div className="d-flex">
                                                                                        <Image
                                                                                            src={doctor.user.avatar}
                                                                                            roundedCircle
                                                                                            width={45}
                                                                                            height={45}
                                                                                            className="me-2"
                                                                                            style={{
                                                                                                objectFit: "cover",
                                                                                                border: "2px solid #e9ecef"
                                                                                            }}
                                                                                        />
                                                                                        <div className="flex-grow-1">
                                                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                                                <h6 className="text-primary mb-0">
                                                                                                    Bác sĩ {doctor.user.firstName} {doctor.user.lastName}
                                                                                                    <span className="text-muted ms-2 small">
                                                                                                        {formatDate(r.responseDate)}
                                                                                                    </span>
                                                                                                </h6>
                                                                                                {user && user.userId === doctor.doctorId && (
                                                                                                    <Button
                                                                                                        variant="link"
                                                                                                        className="p-0 text-primary"
                                                                                                        onClick={() => {
                                                                                                            setIsEditing(r.reviewId);
                                                                                                            setEditedResponses(prev => ({
                                                                                                                ...prev,
                                                                                                                [r.reviewId]: r.doctorResponse
                                                                                                            }));
                                                                                                        }}
                                                                                                    >
                                                                                                        <i className="bi bi-pencil-square me-1"></i>
                                                                                                        Chỉnh sửa
                                                                                                    </Button>
                                                                                                )}
                                                                                            </div>
                                                                                            <p className="text-secondary mb-0">{r.doctorResponse}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                user && user.userId === doctor.doctorId && (
                                                                                    <Button
                                                                                        variant="outline-primary"
                                                                                        size="sm"
                                                                                        className="mt-2"
                                                                                        onClick={() => {
                                                                                            setIsEditing(r.reviewId);
                                                                                            setEditedResponses(prev => ({
                                                                                                ...prev,
                                                                                                [r.reviewId]: ""
                                                                                            }));
                                                                                        }}
                                                                                    >
                                                                                        <i className="bi bi-reply me-1"></i>
                                                                                        Phản hồi
                                                                                    </Button>
                                                                                )
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                ))
                                        ) : (
                                            <div className="text-center text-muted">Chưa có đánh giá nào!</div>
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

