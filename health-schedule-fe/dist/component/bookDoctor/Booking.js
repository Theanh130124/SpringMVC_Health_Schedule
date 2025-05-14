"use strict";
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
const MyContexts_1 = require("../../configs/MyContexts");
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = require("../../configs/Apis");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const MyToaster_1 = __importDefault(require("../layout/MyToaster"));
const MyConfirm_1 = __importDefault(require("../layout/MyConfirm"));
const ConvertToVietnamTime_1 = require("../../utils/ConvertToVietnamTime");
const Booking = () => {
    var _a;
    const [loading, setLoading] = (0, react_1.useState)(false);
    const location = (0, react_router_dom_1.useLocation)();
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const slot = (_a = location.state) === null || _a === void 0 ? void 0 : _a.slot;
    const [appointment, setAppointment] = (0, react_1.useState)({});
    const nav = (0, react_router_dom_1.useNavigate)();
    const formattedDate = slot.slotDate ? (0, ConvertToVietnamTime_1.ConvertToVietnamTime)(slot.slotDate) : "";
    const formattedTime = slot.startTime || "";
    const fullTime = `${formattedDate} ${formattedTime}`;
    //của patient
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const addInvoice = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            // Tạo đối tượng FormData
            const formData = new FormData();
            formData.append("amount", appointment.doctorId.consultationFee);
            formData.append("dueDate", today);
            formData.append("appointmentId", appointment.appointmentId);
            // Gửi yêu cầu với FormData
            const response = yield (0, Apis_1.authApis)().post(`invoice`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Đặt header cho form-data
                },
            });
            if (response.data) {
                return response.data.invoiceId;
            }
            else {
                console.log("Không thể tạo hóa đơn . Vui lòng thử lại.");
                return null;
            }
        }
        catch (error) {
            console.error("Lỗi khi tạo hóa đơn:", error);
            console.log("Đã xảy ra lỗi. Vui lòng thử lại.");
            return null;
        }
        finally {
            setLoading(false);
        }
    });
    const Booking = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            let res = yield (0, Apis_1.authformdataApis)().post(Apis_1.endpoint['bookdoctor'], {
                patientId: user.userId,
                doctorId: slot.doctorId.doctorId,
                clinicId: slot.doctorId.clinics[0].clinicId,
                time: fullTime,
                reason: appointment.reason,
                duration: 120,
                type: "Offline",
            });
            setAppointment(res); // không . data vì res là 1 object
            //Đặt lịch xong thì tạo hóa đơn
            yield addInvoice();
            react_hot_toast_1.default.success("Đặt lịch thành công!");
            nav("/appointment"); //Đặt xong về xem lịch hẹn
        }
        catch (ex) {
            // console.log(user.userId);
            // console.log(slot.doctorId.doctorId);
            // console.log(slot.doctorId.clinics[0].clinicId);
            // console.log(fullTime);
            // console.log(appointment.reason);
            // console.error(ex);
            react_hot_toast_1.default.error("Đặt lịch thất bại!");
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
    return (<>

            <react_bootstrap_1.Container fluid className="p-0">

                <react_bootstrap_1.Row className="justify-content-center custom-row-primary mt-4">



                    <react_bootstrap_1.Col lg={8} md={10} sm={12}>
                        <react_bootstrap_1.Container className="p-3 shadow rounded bg-light me-5">
                            <h2 className="text-center">Thông tin chi tiết</h2>
                            <react_bootstrap_1.Card>

                                <react_bootstrap_1.Card.Body className="card-body-custom">
                                    <react_bootstrap_1.Card.Text className="card-text">
                                        <strong>Thời gian khám:</strong> {slot.startTime} - {slot.endTime}
                                        <br />
                                        <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                        <br />
                                        <strong>Bác sĩ khám:</strong> {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                        <br />




                                    </react_bootstrap_1.Card.Text>

                                    {slot.doctorId.specialties.map(s => (<strong key={s.specialtyId}>Chuyên khoa: {s.name}</strong>))}

                                    {slot.doctorId.clinics.map(c => (<react_bootstrap_1.Card.Text key={c.clinicId} className="card-text">
                                            <strong>Chi phí khám:</strong> {slot.doctorId.consultationFee.toLocaleString('vi-VN')} VNĐ
                                            <br />
                                            <strong>Bệnh viện:</strong> {c.name}
                                            <br />
                                            <strong>Địa chỉ:</strong> {c.address}
                                        </react_bootstrap_1.Card.Text>))}

                                    <react_bootstrap_1.FloatingLabel label="Lý do khám" className="mb-3">
                                        <react_bootstrap_1.Form.Control type="text" placeholder="Lý do khám bệnh" required value={appointment.reason || ''} onChange={(e) => setAppointment(Object.assign(Object.assign({}, appointment), { reason: e.target.value }))}/>
                                    </react_bootstrap_1.FloatingLabel>


                                    <react_bootstrap_1.Button variant="success" onClick={handleConfirm} disabled={loading}>
                                        Xác nhận đặt lịch
                                    </react_bootstrap_1.Button>
                                </react_bootstrap_1.Card.Body>
                            </react_bootstrap_1.Card>
                        </react_bootstrap_1.Container>



                    </react_bootstrap_1.Col>



                </react_bootstrap_1.Row>
                <MyConfirm_1.default show={showConfirm} onHide={handleClose} onConfirm={Booking} loading={loading} title="Xác nhận đặt lịch" body="Bạn có chắc chắn muốn đặt lịch hẹn này không?"/>


                <react_bootstrap_1.Row>


                </react_bootstrap_1.Row>
            </react_bootstrap_1.Container>
        </>);
};
exports.default = Booking;
//     return (
//         <Container fluid className="p-0">
//             <Row className="justify-content-center custom-row-primary mt-4">
//                 <Col lg={8} md={10} sm={12}>
//                     <h2 className="text-center">Thông tin chi tiết</h2>
//                     {slot ? (
//                         <div>
//                             <p>Bác sĩ: {slot.doctorId.user.firstName} {slot.doctorId.user.lastName}</p>
//                             <p>Thời gian: {slot.startTime} - {slot.endTime}</p>
//                             <p>Ngày: {slot.slotDate}</p>
//                             <p>Chuyên môn: {slot.doctorId.bio}</p>
//                         </div>
//                     ) : (
//                         <p>Không có thông tin slot</p>
//                     )}
//                 </Col>
//             </Row>
//         </Container>
//     );
// };
