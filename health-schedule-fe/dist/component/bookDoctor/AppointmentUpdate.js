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
const react_router_dom_1 = require("react-router-dom");
const ConvertToVietnamTime_1 = require("../../utils/ConvertToVietnamTime");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const MySpinner_1 = __importDefault(require("../layout/MySpinner"));
const react_bootstrap_1 = require("react-bootstrap");
const MyConfirm_1 = __importDefault(require("../layout/MyConfirm"));
//Hủy hoặc sửa lịch trong 24h
const AppointmentUpdate = () => {
    var _a;
    const [slots, setSlots] = (0, react_1.useState)([]);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const location = (0, react_router_dom_1.useLocation)();
    const appointments = (_a = location.state) === null || _a === void 0 ? void 0 : _a.appointment;
    const [selectedSlot, setSelectedSlot] = (0, react_1.useState)(null);
    const [reason, setReason] = (0, react_1.useState)((appointments === null || appointments === void 0 ? void 0 : appointments.reason) || "");
    const nav = (0, react_router_dom_1.useNavigate)();
    //Tải lên danh sách lịch hẹn trống 
    const fetchSlots = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            let res = yield Apis_1.default.get(Apis_1.endpoint.findDoctorById(appointments.doctorId.doctorId));
            setSlots(res.data);
        }
        catch (ex) {
            console.log("Lỗi khi lấy danh sách slots:", ex);
        }
        finally {
            setLoading(false);
        }
    });
    const handleUpdateAppointment = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            const payload = {
                doctorId: appointments.doctorId.doctorId,
                reason: reason,
            };
            // Nếu người dùng chọn thời gian mới, thêm `time` vào payload
            if (selectedSlot) {
                const formattedDate = (0, ConvertToVietnamTime_1.ConvertToVietnamTime)(selectedSlot.slotDate);
                const fullTime = `${formattedDate} ${selectedSlot.startTime}`;
                payload.time = fullTime;
            }
            yield (0, Apis_1.authApis)().patch(Apis_1.endpoint["updateBookDoctor"](appointmentId), payload);
            nav("/appointment");
            react_hot_toast_1.default.success("Cập nhật lịch hẹn thành công!");
        }
        catch (ex) {
            react_hot_toast_1.default.error("Cập nhật lịch hẹn thất bại!");
            // console.error("Lỗi khi lấy danh sách slots:", ex);
            // const formattedDate = ConvertToVietnamTime(selectedSlot.slotDate);
            // console.log(`${formattedDate} ${selectedSlot.startTime}`);
            // console.log(appointments.appointmentId);
            // console.log(appointments.doctorId.doctorId);
        }
        finally {
            setLoading(false);
            setShowConfirm(false);
        }
    });
    const handleConfirm = () => {
        setShowConfirm(true);
    };
    const handleClose = () => {
        setShowConfirm(false);
    };
    (0, react_1.useEffect)(() => {
        fetchSlots();
    }, [appointments]);
    return (<>
            <react_bootstrap_1.Container fluid className="p-0">

                <react_bootstrap_1.Row className="justify-content-center custom-row-primary mt-4">
                    <react_bootstrap_1.Col lg={8} md={10} sm={12}>
                        <h2 className="text-center">Sửa lịch hẹn</h2>
                        {loading && <MySpinner_1.default />}
                        {!loading && (<react_bootstrap_1.Card>
                                <react_bootstrap_1.Card.Body className="card-body-custom">
                                    <react_bootstrap_1.Form.Group>
                                        <react_bootstrap_1.Form.Label>Chọn thời gian mới:</react_bootstrap_1.Form.Label>
                                        <react_bootstrap_1.Form.Select value={(selectedSlot === null || selectedSlot === void 0 ? void 0 : selectedSlot.slotId) || ""} onChange={(e) => setSelectedSlot(slots.find((slot) => slot.slotId === parseInt(e.target.value)))}>
                                            <option value="">-- Chọn thời gian  --</option>
                                            {slots.map((slot) => (<option key={slot.slotId} value={slot.slotId}>
                                                    {` Ngày : ${(0, ConvertToVietnamTime_1.ConvertToVietnamTime)(slot.slotDate)} - Thời gian bắt đầu : ${slot.startTime}`}
                                                </option>))}
                                        </react_bootstrap_1.Form.Select>
                                    </react_bootstrap_1.Form.Group>
                                    <react_bootstrap_1.Form.Group className="mt-3">
                                        <react_bootstrap_1.Form.Label>Lý do khám:</react_bootstrap_1.Form.Label>
                                        <react_bootstrap_1.Form.Control as="textarea" rows={3} placeholder="Nhập lý do khám" value={reason} onChange={(e) => setReason(e.target.value)}/>
                                    </react_bootstrap_1.Form.Group>

                                    <react_bootstrap_1.Button variant="primary" className="mt-3" onClick={handleConfirm} disabled={loading}>
                                        Cập nhật lịch hẹn
                                    </react_bootstrap_1.Button>
                                </react_bootstrap_1.Card.Body>
                            </react_bootstrap_1.Card>)}
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>

                <MyConfirm_1.default show={showConfirm} onHide={handleClose} onConfirm={() => handleUpdateAppointment(appointments.appointmentId)} loading={loading} title="Xác nhận sửa lịch đặt lịch" body="Bạn có chắc chắn muốn sửa lịch hẹn này không?"/>
            </react_bootstrap_1.Container>
        </>);
};
exports.default = AppointmentUpdate;
