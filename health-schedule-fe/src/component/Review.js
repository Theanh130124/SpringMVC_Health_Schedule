
import axios from "axios"
import { use, useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Apis, { endpoint } from "../configs/Apis"
import { Container, Row, Col, Card, Image, Spinner, Button, Form } from "react-bootstrap";
import { MyDoctorContext } from "../configs/MyContexts";
import RatingIcon from "../utils/RattingIcon";
import "./Styles/Comment.css"
import { authApis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContexts";
const Review = () => {

    const [q, setQ] = useSearchParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [doctor, setDoctor] = useContext(MyDoctorContext);//Xem xet lai lay bac si theo id chu khong nen lay bang useContext

    const [editedResponses, setEditedResponses] = useState({});
    const [isEditing, setIsEditing] = useState(null);
    const user = useContext(MyUserContext);
    const [updateLoading, setUpdateLoading] = useState(false)

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString("vi-VN");
    }

    useEffect(() => {
        const fetchReviews = async () => {

            try {
                let doctorId = q.get("doctorId")
                if (doctorId) {
                    let url = `${endpoint['reviews']}/${doctorId}?page=${page}`
                    let res = await Apis.get(url);
                    if (res.data.length === 0) {
                        setPage(0);
                    }
                    if(page===1){
                        setReviews(res.data)
                    }
                    else
                    {
                        setReviews(prev => [...prev, ...res.data]);
                    }
                }
                else {
                    return
                }

            } catch (error) {
                console.log("Khong the lay danh gia: ", error)
            }
            finally {
                setLoading(false)
            }

        }
        if (page > 0) {
            fetchReviews();
        }
    }, [ page])

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

    useEffect(()=>{
        setReviews([])
        setPage(1)
    },[q])

    return (
        <>
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={3} sm={10}>
                        <Card className="shadow-sm rounded-4 border-0" style={{ background: "#f5f9ff", fontSize: "0.9rem" }}>
                            <Card.Img
                                variant="top"
                                src={doctor.userDTO.avatar}
                                className="rounded-top"
                                style={{ objectFit: "cover", height: "140px" }}
                            />
                            <Card.Body className="p-2">
                                <Card.Title className="text-primary fs-6 fw-bold mb-2">
                                    {doctor.userDTO.firstName} {doctor.userDTO.lastName}
                                </Card.Title>

                                <Card.Text className="mb-1">
                                    <i className="bi bi-hospital text-info me-1"></i>
                                    <strong>Chuyên khoa:</strong> {doctor.specialties?.map((s) => s.name).join(", ")}
                                </Card.Text>

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
                    </Col>
                </Row>

                {/* Danh gia */}
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
                                    reviews.map((r) => (
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
                                                        {r.patientId.user.firstName} {r.patientId.user.lastName}{" "}
                                                        <span className="review-date">- {formatDate(r.reviewDate)}</span>
                                                    </h6>
                                                    <p className="comment-content mb-2">{r.comment}</p>

                                                    <div className="mt-3">
                                                        {isEditing === r.reviewId ? (
                                                            // Đang chỉnh sửa phản hồi
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
                                                        ) : user.userId === doctor.userDTO.id ? (
                                                            r.doctorResponse ? (
                                                                <div className="reply-box">
                                                                    <div className="d-flex">
                                                                        <Image
                                                                            src={doctor.userDTO.avatar}
                                                                            roundedCircle
                                                                            width={40}
                                                                            height={40}
                                                                            className="me-2"
                                                                        />
                                                                        <div>
                                                                            <h6 className="text-primary">
                                                                                Bác sĩ{" "}
                                                                                <span className="text-muted small">
                                                                                    - {formatDate(r.responseDate)}
                                                                                </span>
                                                                            </h6>
                                                                            <p className="small">{r.doctorResponse}</p>
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
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
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
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ): 
                                <div>Khong co danh gia</div> }
                                </Col>
                            </Row>
                        </Container>
                    </section>
                )}

            </Container>

            {/* Xem thêm */}

            <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {page>0 && (
                    <Col md={1} lg={1} xs={1}>
                        <Button variant="info" onClick={loadMore} > Xem thêm</Button>
                    </Col>
                )}
            </Row>
            <Row className="g-4 mb-4 mt-4"></Row>
        </>
    )

}

export default Review
