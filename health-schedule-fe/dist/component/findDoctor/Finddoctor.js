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
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const Apis_1 = __importStar(require("../../configs/Apis"));
const react_router_dom_1 = require("react-router-dom");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const MySpinner_1 = __importDefault(require("../layout/MySpinner"));
const RattingIcon_1 = __importDefault(require("../../utils/RattingIcon"));
const react_2 = require("react");
const react_hot_toast_1 = require("react-hot-toast");
const MyConfigs_1 = __importDefault(require("../../configs/MyConfigs"));
const Finddoctor = () => {
    // Nhớ làm xem thêm
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [doctors, setDoctors] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(1);
    const [q, setQ] = (0, react_router_dom_1.useSearchParams)();
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [keyword, setKeyword] = (0, react_1.useState)("");
    const nav = (0, react_router_dom_1.useNavigate)();
    const handleKeywordChange = (e) => {
        let value = e.target.value;
        setKeyword(value);
        setQ({ keyword: value });
    };
    const handlerFinDoctor = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            let res = yield Apis_1.default.get(Apis_1.endpoint.findDoctorById(doctorId));
            nav("/calendar", { state: { slots: res.data || [] } });
            react_hot_toast_1.toast.success("Lấy lịch trống thành công!");
        }
        catch (ex) {
            console.error("Lỗi khi xem lịch trống" + ex);
        }
        finally {
            setLoading(false);
        }
    });
    const loadDoctors = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let keyword = q.get('keyword');
            if (!keyword || keyword.trim() === "") {
                setDoctors([]);
                return;
            }
            setLoading(true);
            let url = `${Apis_1.endpoint['doctor']}?page=${page}&keyword=${keyword}`;
            let res = yield Apis_1.default.get(url);
            if (page === 1) {
                setDoctors(res.data);
            }
            else {
                setDoctors(prev => [...prev, ...res.data]);
            }
            if (res.data.length < MyConfigs_1.default.PAGE_SIZE) {
                setHasMore(false);
            }
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        setPage(1);
        setHasMore(true);
        setDoctors([]);
    }, [q]);
    (0, react_1.useEffect)(() => {
        loadDoctors();
    }, [page, q]);
    return (<>
            <react_bootstrap_1.Container fluid className="p-0">
                <react_bootstrap_1.Row className="justify-content-center g-4 custom-row mt-5 search-bar">
                    <react_bootstrap_1.Col xs={12} className="text-center">
                        <h2 className="search-title">
                            <i className="bi bi-search-heart me-2 search-icon"></i> Tìm kiếm bác sĩ
                        </h2>
                        <p className="search-subtitle">Nhập tên bác sĩ, chuyên khoa hoặc phòng khám để tìm kiếm</p>
                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col md={6} lg={6} xs={12}>
                        <react_bootstrap_1.Form.Control type="text" placeholder="Tìm bác sĩ, chuyên khoa hoặc phòng khám..." value={keyword} className="search-input rounded-pill shadow-sm" onChange={handleKeywordChange}/>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>


                <react_bootstrap_1.Row className="justify-content-center g-4  mt-4">

                    {loading && !q.get('keyword') && (<div className="text-center mt-4">
                            <MySpinner_1.default />
                        </div>)}
                    {doctors.length === 0 && <react_bootstrap_1.Alert variant="info" className="m-2 text-center">Không tìm thấy bác sĩ nào!</react_bootstrap_1.Alert>}
                    {doctors === null || doctors === void 0 ? void 0 : doctors.map(d => {
            var _a, _b;
            return (<react_bootstrap_1.Col key={d.doctorId} xs={12} sm={6} md={4} lg={3}>
                            <react_bootstrap_1.Card className="card-doctor shadow-sm">
                                <react_bootstrap_1.Card.Img variant="top" src={d.userDTO.avatar}/>
                                <react_bootstrap_1.Card.Body className="card-body-custom">
                                    <div>
                                        <react_bootstrap_1.Card.Title className="card-title"> Bác sĩ : {`${d.userDTO.firstName} ${d.userDTO.lastName}`.split(' ').slice(0, 4).join(' ')}
                                            {`${d.userDTO.firstName} ${d.userDTO.lastName}`.split(' ').length > 4 && '...'}</react_bootstrap_1.Card.Title>

                                        {/*  */}

                                        {(_a = d.specialties) === null || _a === void 0 ? void 0 : _a.map(s => (<react_bootstrap_1.Card.Text key={s.specialtyId} className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Chuyên khoa:</strong> {s.name}
                                        </react_bootstrap_1.Card.Text>))}



                                        {(_b = d.clinics) === null || _b === void 0 ? void 0 : _b.map(c => (<react_bootstrap_1.Card.Text key={c.clinicId} className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Bệnh viên : </strong>{c.name} <br />
                                            <strong>Địa chỉ: </strong>{c.address}
                                        </react_bootstrap_1.Card.Text>))}
                                        <react_bootstrap_1.Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Đánh giá :</strong> {d.averageRating} <RattingIcon_1.default rating={d.averageRating}/>
                                        </react_bootstrap_1.Card.Text>

                                        <react_bootstrap_1.Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                            <strong>Phí khám:</strong>  {d.consultationFee.toLocaleString('vi-VN')} VNĐ
                                        </react_bootstrap_1.Card.Text>




                                    </div>
                                    <div className="d-grid gap-1 mt-2">
                                        {/* Xem lịch trống là tìm lịch trống theo id doctor đó */}
                                        <react_bootstrap_1.Button variant="primary" onClick={() => handlerFinDoctor(d.doctorId)} size="sm">Xem lịch trống</react_bootstrap_1.Button>
                                        <react_bootstrap_1.Button variant="danger" as={react_router_dom_1.Link} to={`/review/?doctorId=${d.doctorId}`} size="sm">Xem đánh giá</react_bootstrap_1.Button>
                                    </div>
                                </react_bootstrap_1.Card.Body>
                            </react_bootstrap_1.Card>
                        </react_bootstrap_1.Col>);
        })}
                </react_bootstrap_1.Row>



                {/* Xem thêm */}

                <react_bootstrap_1.Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                    {hasMore && doctors.length > 0 && !loading && (<react_bootstrap_1.Col md={8} lg={6} xs={10}>
                            <react_bootstrap_1.Button variant="info" onClick={() => setPage(prev => prev + 1)}> Xem thêm</react_bootstrap_1.Button>
                        </react_bootstrap_1.Col>)}
                </react_bootstrap_1.Row>
                <react_bootstrap_1.Row className="g-4 mb-4 mt-4"></react_bootstrap_1.Row>

            </react_bootstrap_1.Container>
        </>);
};
exports.default = Finddoctor;
