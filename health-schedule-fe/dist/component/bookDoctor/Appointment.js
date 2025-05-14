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
const Apis_1 = require("../../configs/Apis");
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const react_cookies_1 = require("react-cookies");
const MySpinner_1 = __importDefault(require("../layout/MySpinner"));
const MyConfigs_1 = __importDefault(require("../../configs/MyConfigs"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const MyConfirm_1 = __importDefault(require("../layout/MyConfirm"));
const Appointment = () => {
    //Phân trang cho thằng này
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [appointments, setAppointments] = (0, react_1.useState)([]);
    const [page, setPage] = (0, react_1.useState)(1);
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const [msg, setMsg] = (0, react_1.useState)("");
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [showConfirm, setShowConfirm] = (0, react_1.useState)({
        show: false,
        appointmentId: null,
        doctorId: null,
        createdAt: null,
    });
    const nav = (0, react_router_dom_1.useNavigate)();
    // Tạo roomchat -> làm này xem thêm
    const [room, setRoom] = (0, react_1.useState)();
    //doctorId chỉ lấy 1 trong list appointment 
    //prev ghi lại dữ liệu -> dùng loading sẽ bị đè
    const createRoom = (doctorId, appointment) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { [appointment.appointmentId]: true })));
            let res = yield (0, Apis_1.fbApis)().post(Apis_1.endpoint['chats'], {
                "userId1": user.userId,
                "userId2": doctorId,
            });
            const roomData = res.data;
            //truyền appointment vào để lấy thông tin của doctor 
            nav("/roomchat", {
                state: {
                    room: roomData,
                    appointment: appointment
                },
            });
        }
        catch (ex) {
            console.error(ex);
        }
        finally {
            setLoading(prev => (Object.assign(Object.assign({}, prev), { [appointment.appointmentId]: false })));
        }
    });
    const deleteAppointment = (appointmentId, doctorId, createdAt) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            // Kiểm tra thời gian tạo lịch hẹn
            const now = new Date().getTime();
            const createdTime = new Date(createdAt).getTime();
            const diffInMilliseconds = now - createdTime;
            if (diffInMilliseconds > 24 * 60 * 60 * 1000) {
                react_hot_toast_1.default.error("Bạn không thể hủy lịch hẹn sau 24 giờ!");
                return; // Dừng thực hiện nếu quá 24 giờ
            }
            // Gửi yêu cầu xóa lịch hẹn
            yield (0, Apis_1.authApis)().delete(Apis_1.endpoint['deleteBookDoctor'](appointmentId), {
                data: { doctorId: doctorId },
            });
            yield loadAppointments();
            react_hot_toast_1.default.success("Hủy lịch thành công!");
        }
        catch (ex) {
            react_hot_toast_1.default.error("Hủy lịch thất bại!");
            console.error("Lỗi khi hủy lịch:", ex);
        }
        finally {
            setLoading(false);
            setShowConfirm(false);
        }
    });
    const loadAppointments = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            let url = `${Apis_1.endpoint['listAppointment']}?page=${page}`;
            if (user.userId !== null) {
                if (user.role === "Patient") {
                    url += `&patientId=${user.userId}`;
                }
                if (user.role === "Doctor") {
                    url += `&doctorId=${user.userId}`;
                }
            }
            const res = yield (0, Apis_1.authApis)().get(url);
            if (page === 1) {
                setAppointments(res.data);
            }
            else {
                setAppointments(prev => [...prev, ...res.data]);
            }
            if (res.data.length < MyConfigs_1.default.PAGE_SIZE) {
                setHasMore(false);
            }
        }
        catch (ex) {
            setMsg(`Đã có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
            console.error(ex);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        setPage(1);
        setHasMore(true);
        setAppointments([]);
    }, []);
    (0, react_1.useEffect)(() => {
        loadAppointments();
    }, [page]);
    const handleNavUpdate = (appointment) => {
        try {
            setLoading(true);
            const now = new Date().getTime();
            const createdAt = new Date(appointment.createdAt).getTime();
            const diffInMilliseconds = now - createdAt;
            if (diffInMilliseconds <= 24 * 60 * 60 * 1000) {
                nav("/updateAppointment", {
                    state: {
                        appointment
                    }
                });
            }
            else {
                react_hot_toast_1.default.error("Bạn không thể sửa lịch hẹn sau 24 giờ!");
            }
        }
        catch (ex) {
            console.error("Lỗi khi kiểm tra thời gian:", ex);
        }
        finally {
            setLoading(false);
        }
    };
    const handleInvoiceRedirect = (appointment) => {
        if (appointment) {
            //Neu dung navigate thi nho bo {Link} o trong Button
            nav("/invoice", { state: { appointment } });
        }
    };
    const handleConfirm = (appointmentId, doctorId, createdAt) => {
        setShowConfirm({
            show: true,
            appointmentId,
            doctorId,
            createdAt,
        });
    };
    const handleClose = () => {
        setShowConfirm(false);
    };
    return (<react_bootstrap_1.Container fluid className="p-0 container-custom">

            <react_bootstrap_1.Row className="g-4 mt-5">

                {appointments.length === 0 && <react_bootstrap_1.Alert variant="info" className="m-2 text-center">Bạn không có lịch hẹn nào!</react_bootstrap_1.Alert>}

                {appointments.map(a => (<react_bootstrap_1.Col key={a.appointmentId} md={4} lg={4} xs={12}>
                        <react_bootstrap_1.Card className="card-doctor shadow-sm">
                            <react_bootstrap_1.Card.Body className="card-body-custom">
                                <div>
                                    <react_bootstrap_1.Card.Title className="card-title"> Ngày hẹn : {new Date(a.appointmentTime).toLocaleDateString("vi-VN")}
                                    </react_bootstrap_1.Card.Title>
                                    <react_bootstrap_1.Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        {user.role === "Patient" && (<>
                                                <strong>Bác sĩ khám:</strong> {a.doctorId.user.firstName} {a.doctorId.user.lastName}
                                                <br />
                                            </>)}
                                        {user.role === "Doctor" && (<>
                                                <strong>Bệnh nhân khám:</strong> {a.patientId.user.firstName} {a.patientId.user.lastName}
                                                <br />
                                            </>)}
                                        <strong>Bệnh viện:</strong> {a.clinicId.name}
                                        <br />
                                        <strong>Địa điểm khám:</strong> {a.clinicId.address}
                                        <br />



                                    </react_bootstrap_1.Card.Text>


                                    <react_bootstrap_1.Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                                        <strong>Thời gian bắt đầu khám:</strong> {new Date(a.appointmentTime).toLocaleTimeString("vi-VN")}
                                        <br />
                                        <strong>Thời lượng cuộc hẹn:</strong> {a.durationMinutes} phút
                                        <br />
                                        <strong>Lý do khám:</strong> {a.reason}
                                        <br />
                                        <strong>Trạng thái cuộc hẹn:</strong> {a.status}
                                        <br />

                                    </react_bootstrap_1.Card.Text>

                                    <react_bootstrap_1.Card.Text className="card-text " style={{ fontSize: '0.85rem', color: 'red' }}>
                                        <strong>Lịch khám được đặt vào ngày :</strong>  {new Date(a.createdAt).toLocaleString("vi-VN")}
                                    </react_bootstrap_1.Card.Text>



                                    {/* Có lý do hủy có thể thêm */}

                                    {/* Đưa peerjs vào callvideo */}
                                    {/* <Card.Text className="card-text" style={{ fontSize: '0.85rem' }}>
                Link Videocall:
            </Card.Text> */}
                                </div>
                                {/* Fix ở bác sĩ thì là tên bệnh nhân */}
                                {user.role === "Doctor" && (<div className="d-grid gap-1 mt-2">
                                        {loading[a.appointmentId] === true ? (<MySpinner_1.default />) : (<react_bootstrap_1.Button variant="success" onClick={() => createRoom(a.patientId.patientId, a)} size="sm">
                                                Chat với bệnh nhân
                                            </react_bootstrap_1.Button>)}
                                    </div>)}

                                {user.role === "Patient" && (<div className="d-grid gap-1 mt-2">
                                        {/* Chỉ Bệnh nhân được sửa hoặc hủy lịch trong 24h */}
                                        {loading[a.appointmentId] === true ? (<MySpinner_1.default />) : (<react_bootstrap_1.Button variant="success" onClick={() => createRoom(a.doctorId.doctorId, a)} size="sm">
                                                Chat với bác sĩ
                                            </react_bootstrap_1.Button>)}

                                        <react_bootstrap_1.Button variant="primary" onClick={() => handleNavUpdate(a)} size="sm">
                                            Sửa lịch hẹn
                                        </react_bootstrap_1.Button>

                                        <react_bootstrap_1.Button variant="danger" disabled={loading} onClick={() => handleConfirm(a.appointmentId, a.doctorId.doctorId, a.createdAt)} size="sm">
                                            Hủy lịch hẹn
                                        </react_bootstrap_1.Button>


                                        <react_bootstrap_1.Button variant="primary" disabled={loading} onClick={() => handleInvoiceRedirect(a)} size="sm">
                                            Xem hóa đơn

                                        </react_bootstrap_1.Button>
                                    </div>)}

                            </react_bootstrap_1.Card.Body>
                        </react_bootstrap_1.Card>

                        <MyConfirm_1.default show={showConfirm.show} onHide={handleClose} onConfirm={() => deleteAppointment(showConfirm.appointmentId, showConfirm.doctorId, showConfirm.createdAt)} loading={loading} title="Xác nhận hủy lịch" body="Bạn có chắc chắn muốn hủy lịch hẹn này không?"/>


                    </react_bootstrap_1.Col>))}


            </react_bootstrap_1.Row>



            <react_bootstrap_1.Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
                {hasMore && appointments.length > 0 && !loading && (<react_bootstrap_1.Col md={8} lg={6} xs={10}>
                        <react_bootstrap_1.Button variant="info" onClick={() => setPage((prev) => prev + 1)}>Xem thêm</react_bootstrap_1.Button>
                    </react_bootstrap_1.Col>)}
            </react_bootstrap_1.Row>
            <react_bootstrap_1.Row className="mt-5 mb-4"></react_bootstrap_1.Row>


            {loading && (<div className="text-center mt-4">
                    <MySpinner_1.default />
                </div>)}
        </react_bootstrap_1.Container>);
};
exports.default = Appointment;
