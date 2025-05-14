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
const Apis_1 = __importStar(require("../../configs/Apis"));
const react_bootstrap_1 = require("react-bootstrap");
const react_cookies_1 = require("react-cookies");
const MySpinner_1 = __importDefault(require("../layout/MySpinner"));
const react_router_dom_1 = require("react-router-dom");
const MyContexts_1 = require("../../configs/MyContexts");
require("../Styles/Calendar.css");
const LoadMoreButton_1 = __importDefault(require("../layout/LoadMoreButton"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const MyConfigs_1 = __importDefault(require("../../configs/MyConfigs"));
const Calendar = () => {
    var _a;
    const location = (0, react_router_dom_1.useLocation)();
    const initialSlots = ((_a = location.state) === null || _a === void 0 ? void 0 : _a.slots) || [];
    //Để lấy lịch từ xem lịch trống riêng bác sĩ
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [slots, setSlots] = (0, react_1.useState)(initialSlots);
    const [page, setPage] = (0, react_1.useState)(1);
    const [date, setDate] = (0, react_1.useState)("");
    const [time, setTime] = (0, react_1.useState)("");
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const nav = (0, react_router_dom_1.useNavigate)();
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : "";
    const formattedTime = time ? `${time}:00` : "";
    //Theo doctorId ở bên Finddoctor.js -> nút xem lịch trống
    const loadSlots = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            setLoading(true);
            if (initialSlots.length > 0) {
                setSlots(initialSlots);
                setHasMore(false);
                return;
            }
            if ((_a = location.state) === null || _a === void 0 ? void 0 : _a.doctorId) {
                url += `&doctorId=${location.state.doctorId}`;
            }
            let url = `${Apis_1.endpoint['findDoctor']}?page=${page}`;
            if (formattedDate) {
                url += `&slotDate=${formattedDate}`;
            }
            if (formattedTime) {
                url += `&startTime=${formattedTime}`;
            }
            const res = yield Apis_1.default.get(url);
            if (page === 1) {
                setSlots(res.data);
            }
            else {
                setSlots(prev => [...prev, ...res.data]);
            }
            //dữ liệu cuối cùng gửi về < số lượng sp 1 trang
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
        if (initialSlots.length > 0) {
            setSlots(initialSlots);
            setPage(1);
            setHasMore(true);
            setSlots([]);
        }
        else {
            setPage(1);
            setHasMore(true);
            setSlots([]);
        }
    }, [date, time]);
    (0, react_1.useEffect)(() => {
        loadSlots();
    }, [page]);
    //Xử lý riêng k bỏ vào useEffect(() 
    const handleBookingClick = (slot) => {
        if (user === null) {
            react_hot_toast_1.default.error("Vui lòng đăng nhập để đặt lịch khám!");
            nav("/login");
            //Đăng nhập xong thì quay về trang này
        }
        else if (user.role == 'Patient') {
            //Truyền dữ liệu vào state
            nav("/booking", { state: { slot } });
        }
    };
    return (<react_bootstrap_1.Container fluid className="p-0 container-custom">


            <react_bootstrap_1.Row className="g-4 custom-row mt-5 align-items-center search-bar">
                <react_bootstrap_1.Col md={4} lg={4} xs={12}>
                    <react_bootstrap_1.Form.Group>
                        <react_bootstrap_1.Form.Label className="fw-bold text-primary">Chọn ngày</react_bootstrap_1.Form.Label>
                        <react_bootstrap_1.Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-pill shadow-sm"/>
                    </react_bootstrap_1.Form.Group>
                </react_bootstrap_1.Col>
                <react_bootstrap_1.Col md={4} lg={4} xs={12}>
                    <react_bootstrap_1.Form.Group>
                        <react_bootstrap_1.Form.Label className="fw-bold text-primary">Chọn giờ</react_bootstrap_1.Form.Label>
                        <react_bootstrap_1.Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-pill shadow-sm"/>
                    </react_bootstrap_1.Form.Group>
                </react_bootstrap_1.Col>
                <react_bootstrap_1.Col md={4} lg={4} xs={12} className="text-center">
                    <react_bootstrap_1.Button variant="primary" className="search-button mt-4 rounded-pill px-4 shadow-sm" onClick={loadSlots}>
                        <i className="bi bi-search"></i> Tìm kiếm
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
            <react_bootstrap_1.Row className="justify-content-center g-4 mt-5">
                <react_bootstrap_1.Col xs="auto">
                    <h1 className="calendar-title animated-title">Chọn lịch trống</h1>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>


            <react_bootstrap_1.Row className="justify-content-center g-4  mt-5">
                {loading && (<div className="text-center">
                        <MySpinner_1.default />
                    </div>)}
                {slots.length === 0 && (<react_bootstrap_1.Alert variant="info" className="text-center">
                        Không tìm thấy lịch trống nào!
                    </react_bootstrap_1.Alert>)}
                {slots.map((slot) => (<react_bootstrap_1.Col key={slot.slotId} md={4} lg={3} className="mb-4">
                        <react_bootstrap_1.Card className="card-doctor shadow-sm">
                            <react_bootstrap_1.Card.Img variant="top" src={slot.doctorId.userDTO.avatar}/>
                            <react_bootstrap_1.Card.Body className="card-body-custom">
                                <react_bootstrap_1.Card.Title className="card-title">
                                    Bác sĩ: {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                </react_bootstrap_1.Card.Title>
                                <react_bootstrap_1.Card.Text className="card-text">
                                    <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong>Thời gian:</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    {slot.doctorId.specialties.map((s, index) => (<span key={index}>
                                            <strong>Chuyên môn:</strong> {s.name}
                                            <br />
                                        </span>))}
                                    <strong>Phí khám:</strong> {slot.doctorId.consultationFee.toLocaleString('vi-VN')} VNĐ
                                </react_bootstrap_1.Card.Text>
                                <div className="text-center">
                                    <react_bootstrap_1.Button variant="success" className="rounded-pill px-4" onClick={() => handleBookingClick(slot)}>
                                        Đặt lịch
                                    </react_bootstrap_1.Button>
                                </div>
                            </react_bootstrap_1.Card.Body>
                        </react_bootstrap_1.Card>
                    </react_bootstrap_1.Col>))}

            </react_bootstrap_1.Row>


            {/* Xem thêm */}

            <react_bootstrap_1.Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {hasMore && slots.length > 0 && !loading && (<react_bootstrap_1.Col md={8} lg={6} xs={10}>
                        <LoadMoreButton_1.default hasMore={hasMore} loading={loading} onClick={() => setPage((prev) => prev + 1)}/>
                    </react_bootstrap_1.Col>)}
            </react_bootstrap_1.Row>
            <react_bootstrap_1.Row className="g-4 mb-4 mt-4"></react_bootstrap_1.Row>


        </react_bootstrap_1.Container>);
};
exports.default = Calendar;
