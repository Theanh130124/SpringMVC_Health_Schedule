"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = __importStar(require("../../configs/Apis"));
const react_bootstrap_1 = require("react-bootstrap");
const MyContexts_1 = require("../../configs/MyContexts");
const RattingIcon_1 = __importDefault(require("../../utils/RattingIcon"));
require("./StylesComment/Comment.css");
const Apis_2 = require("../../configs/Apis");
const MyContexts_2 = require("../../configs/MyContexts");
const MyConfigs_1 = __importDefault(require("../../configs/MyConfigs"));
const Review = () => {
    const [q] = (0, react_router_dom_1.useSearchParams)(); //dung de lay param tren url
    const [reviews, setReviews] = (0, react_1.useState)([]); //Danh sach danh gia
    const [loading, setLoading] = (0, react_1.useState)(true); //Loading danh sach danh gia
    const [page, setPage] = (0, react_1.useState)(1); //Trang hien tai
    const [doctor, setDoctor] = (0, react_1.useState)({}); //Bac si theo id khi nguoi dung click vao
    const [editedResponses, setEditedResponses] = (0, react_1.useState)({}); //Danh sach cac phan hoi
    const [isEditing, setIsEditing] = (0, react_1.useState)(null); //Kiem tra dang chinh sua hay khong
    const user = (0, react_1.useContext)(MyContexts_2.MyUserContext); //Lay user tu context
    const [updateLoading, setUpdateLoading] = (0, react_1.useState)(false); //Loading khi cap nhat phan hoi
    const [doctors, setDoctors] = (0, react_1.useState)([]); //Danh sach bac si
    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString("vi-VN");
    }
    (0, react_1.useEffect)(() => {
        const fetchDoctor = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let doctorId = q.get('doctorId');
                if (doctorId) {
                    const res = yield Apis_1.default.get(`${Apis_1.endpoint['doctor']}/${doctorId}`);
                    setDoctor(res.data);
                }
            }
            catch (error) {
                console.error("Không thể lấy dữ liệu bác sĩ: ", error);
            }
        });
        fetchDoctor();
    }, [q]); //Fetch bac si khi id thay doi
    (0, react_1.useEffect)(() => {
        const fetchReviewsOrDoctors = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoading(true);
            try {
                let doctorId = q.get('doctorId');
                if (doctorId) { //Neu co truyen doctorId thi lay danh sach danh gia
                    yield fetchReviews(doctorId);
                }
                else {
                    yield fetchDoctors(); //Khong thi lay danh sach bac si
                }
            }
            catch (error) {
                console.error("Không thể lấy dữ liệu: ", error);
            }
            finally {
                setLoading(false);
            }
        });
        if (page > 0) { //Neu trang > 0 thi lay danh sach danh gia hoac bac si
            fetchReviewsOrDoctors();
        }
    }, [q, page]); //Fetch danh sach danh gia hoac bac si khi trang thay doi
    const fetchReviews = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield Apis_1.default.get(`${Apis_1.endpoint['reviews']}/${doctorId}?page=${page}`);
        if (res.data.length < MyConfigs_1.default.PAGE_SIZE)
            setPage(0); //Neu khong con danh gia thi set page = 0 de khong load nua
        setReviews(prev => page === 1 ? res.data : [...prev, ...res.data]);
    });
    const fetchDoctors = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield Apis_1.default.get(`${Apis_1.endpoint['doctor']}?page=${page}`);
        if (res.data.length < MyConfigs_1.default.PAGE_SIZE)
            setPage(0);
        setDoctors(prev => page === 1 ? res.data : [...prev, ...res.data]);
    });
    const handleReplyChange = (reviewId, text) => {
        setEditedResponses(prev => (Object.assign(Object.assign({}, prev), { [reviewId]: text })));
    };
    const handleSaveResponse = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
        const text = editedResponses[reviewId];
        setUpdateLoading(true);
        try {
            let url = `${Apis_1.endpoint['review']}/${reviewId}`;
            console.log(url);
            console.log(user);
            yield (0, Apis_2.authApis)().patch(url, {
                doctorResponse: text
            });
            setReviews(prevReviews => prevReviews.map(r => r.reviewId === reviewId
                ? Object.assign(Object.assign({}, r), { doctorResponse: text, responseDate: Date.now() // Cập nhật ngày trả lời
                 }) : r));
        }
        catch (error) {
            console.log("Khong the cap nhat binh luan: ", error);
        }
        finally {
            setIsEditing(null);
            setUpdateLoading(false);
        }
    });
    const loadMore = () => {
        if (!loading && page > 0) {
            setPage(page + 1);
        }
    };
    (0, react_1.useEffect)(() => {
        setPage(1);
        setReviews([]);
        setDoctors([]);
    }, [q]);
    return (<>
            {loading ? (<div className="text-center">
                    <react_bootstrap_1.Spinner animation="border"/>
                    <p>Đang tải...</p>
                </div>) : q.get("doctorId") === null ? (<react_bootstrap_1.Row>
                    {Array.isArray(doctors) && doctors.map(d => (<react_bootstrap_1.Col key={d.doctorId} md={4} className="mb-4">
                            <react_bootstrap_1.Card className="card-doctor">
                                <react_bootstrap_1.Card.Img src={d.userDTO.avatar} alt={`${d.userDTO.firstName} ${d.userDTO.lastName}`}/>
                                <react_bootstrap_1.Card.Body>
                                    <react_bootstrap_1.Card.Title>{d.userDTO.firstName} {d.userDTO.lastName}</react_bootstrap_1.Card.Title>
                                    <react_bootstrap_1.Card.Text>
                                        <strong>Chuyên khoa:</strong> {d.specialties.map(s => s.name).join(", ")}
                                    </react_bootstrap_1.Card.Text>
                                    <react_bootstrap_1.Card.Text>
                                        <strong>Đánh giá:</strong> {d.averageRating} <RattingIcon_1.default rating={d.averageRating}/>
                                    </react_bootstrap_1.Card.Text>
                                    <react_bootstrap_1.Button variant="primary" as={react_router_dom_1.Link} to={`/review/?doctorId=${d.doctorId}`}>Xem đánh giá</react_bootstrap_1.Button>
                                </react_bootstrap_1.Card.Body>
                            </react_bootstrap_1.Card>
                        </react_bootstrap_1.Col>))}
                </react_bootstrap_1.Row>) : (<react_bootstrap_1.Container className="mt-4">
                    <react_bootstrap_1.Row className="justify-content-center">
                        <react_bootstrap_1.Col md={3} sm={10}>
                            {doctor && doctor.user ? (<react_bootstrap_1.Card className="shadow-sm rounded-4 border-0" style={{ background: "#f5f9ff", fontSize: "0.9rem" }}>
                                    <react_bootstrap_1.Card.Img variant="top" src={doctor.user.avatar} className="rounded-top" style={{ objectFit: "cover", height: "140px" }}/>
                                    <react_bootstrap_1.Card.Body className="p-2">
                                        <react_bootstrap_1.Card.Title className="text-primary fs-6 fw-bold mb-2">
                                            {doctor.user.firstName} {doctor.user.lastName}
                                        </react_bootstrap_1.Card.Title>

                                        <react_bootstrap_1.Card.Text className="mb-1">
                                            <i className="bi bi-star-fill text-warning me-1"></i>
                                            <strong>Đánh giá:</strong> {doctor.averageRating} <RattingIcon_1.default rating={doctor.averageRating}/>
                                        </react_bootstrap_1.Card.Text>

                                        <react_bootstrap_1.Card.Text className="mb-0">
                                            <i className="bi bi-award text-danger me-1"></i>
                                            <strong>Nổi bật:</strong> {doctor.bio}
                                        </react_bootstrap_1.Card.Text>
                                    </react_bootstrap_1.Card.Body>
                                </react_bootstrap_1.Card>) : (<div className="text-center">
                                    <react_bootstrap_1.Spinner animation="border"/>
                                    <p>Đang tải thông tin bác sĩ...</p>
                                </div>)}
                        </react_bootstrap_1.Col>
                    </react_bootstrap_1.Row>

                    {/* Danh sách đánh giá */}
                    {loading ? (<div className="text-center">
                            <react_bootstrap_1.Spinner animation="border"/>
                            <p>Đang tải đánh giá...</p>
                        </div>) : (<section className="comment-section py-5">
                            <react_bootstrap_1.Container>
                                <react_bootstrap_1.Row className="justify-content-center">
                                    <react_bootstrap_1.Col md={8}>
                                        <h4 className="text-center mb-4">Hỏi đáp bác sĩ</h4>
                                        {reviews.length ? (reviews.map((r) => (<react_bootstrap_1.Card key={r.reviewId} className="card-comment mb-3 p-3">
                                                    <div className="d-flex">
                                                        <react_bootstrap_1.Image src={r.patientId.user.avatar || "/default-avatar.png"} roundedCircle width={50} height={50} className="me-3 review-avatar"/>
                                                        <div>
                                                            <h6 className="review-header">
                                                                {r.patientId.user.firstName} {r.patientId.user.lastName}{" "}
                                                                <span className="review-date">- {formatDate(r.reviewDate)}</span>
                                                            </h6>
                                                            <p className="comment-content mb-2">{r.comment}</p>

                                                            <div className="mt-3">
                                                                {isEditing === r.reviewId ? (<react_bootstrap_1.Form.Group controlId={`doctorResponse-${r.reviewId}`}>
                                                                        <react_bootstrap_1.Form.Control as="textarea" rows={3} value={editedResponses[r.reviewId] || ""} onChange={(e) => handleReplyChange(r.reviewId, e.target.value)}/>
                                                                        {updateLoading ? (<div className="spinner-container">
                                                                                <react_bootstrap_1.Spinner animation="border"/>
                                                                                <p>Đang cập nhật...</p>
                                                                            </div>) : (<react_bootstrap_1.Button variant="primary" onClick={() => handleSaveResponse(r.reviewId)}>Save</react_bootstrap_1.Button>)}
                                                                        <react_bootstrap_1.Button variant="secondary" onClick={() => setIsEditing(null)}>Cancel</react_bootstrap_1.Button>
                                                                    </react_bootstrap_1.Form.Group>) : (r.doctorResponse ? (<div className="reply-box">
                                                                            <div className="d-flex">
                                                                                <react_bootstrap_1.Image src={doctor.user.avatar} roundedCircle width={40} height={40} className="me-2"/>
                                                                                <div>
                                                                                    <h6 className="text-primary">
                                                                                        Bác sĩ{" "} {doctor.user.firstName} {doctor.user.lastName}{" "}
                                                                                        <span className="text-muted small">
                                                                                            - {formatDate(r.responseDate)}
                                                                                        </span>
                                                                                    </h6>
                                                                                    <p className="small">{r.doctorResponse}</p>
                                                                                    {user && user.userId === doctor.user.id && (<react_bootstrap_1.Button variant="link" onClick={() => {
                                setIsEditing(r.reviewId);
                                setEditedResponses(prev => (Object.assign(Object.assign({}, prev), { [r.reviewId]: r.doctorResponse })));
                            }}>
                                                                                            Chỉnh sửa
                                                                                        </react_bootstrap_1.Button>)}
                                                                                </div>
                                                                            </div>
                                                                        </div>) : (user && user.userId === doctor.user.id && (<react_bootstrap_1.Button variant="link" onClick={() => {
                            setIsEditing(r.reviewId);
                            setEditedResponses(prev => (Object.assign(Object.assign({}, prev), { [r.reviewId]: "" })));
                        }}>
                                                                                Phản hồi
                                                                            </react_bootstrap_1.Button>)))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </react_bootstrap_1.Card>))) : (<div>Chưa có đánh giá nào!</div>)}
                                    </react_bootstrap_1.Col>
                                </react_bootstrap_1.Row>
                            </react_bootstrap_1.Container>
                        </section>)}
                </react_bootstrap_1.Container>)}

            {/* Nút "Xem thêm" */}
            <react_bootstrap_1.Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {page > 0 && (<react_bootstrap_1.Col md={1} lg={1} xs={1}>
                        <react_bootstrap_1.Button variant="info" onClick={loadMore}>Xem thêm</react_bootstrap_1.Button>
                    </react_bootstrap_1.Col>)}
            </react_bootstrap_1.Row>
            <react_bootstrap_1.Row className="g-4 mb-4 mt-4"></react_bootstrap_1.Row>
        </>);
};
exports.default = Review;
