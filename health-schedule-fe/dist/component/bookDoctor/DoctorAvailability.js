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
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const Apis_1 = require("../../configs/Apis");
const react_bootstrap_1 = require("react-bootstrap");
const MySpinner_1 = __importDefault(require("../layout/MySpinner"));
const react_bootstrap_2 = require("react-bootstrap");
const DoctorAvailability = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const [availabilities, setAvailabilities] = (0, react_1.useState)([]);
    const [showEdit, setShowEdit] = (0, react_1.useState)(false);
    const [editData, setEditData] = (0, react_1.useState)({});
    const [showConfirm, setShowConfirm] = (0, react_1.useState)(false);
    const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    const [newAvailability, setNewAvailability] = (0, react_1.useState)({
        dayOfWeek: "",
        startTime: "",
        endTime: ""
    });
    const normalizeTime = (t) => {
        if (!t)
            return "";
        return t.length === 5 ? t + ":00" : t; // "08:00" => "08:00:00"
    };
    const loadAvailability = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setLoading(true);
            let res = yield (0, Apis_1.authApis)().get(Apis_1.endpoint.getAvailability(user.userId));
            setAvailabilities(res.data);
        }
        catch (error) {
            react_hot_toast_1.default.error("Lỗi khi tải danh sách lịch làm");
            console.log("Lỗi tải danh sách lịch làm " + error);
            // console.log("user:", user);
            // console.log("availabilities:", availabilities);
        }
        finally {
            setLoading(false);
        }
    });
    (0, react_1.useEffect)(() => {
        loadAvailability();
    }, []);
    const handleCreate = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!newAvailability.dayOfWeek || !newAvailability.startTime || !newAvailability.endTime) {
            react_hot_toast_1.default.error("Vui lòng nhập đầy đủ thông tin lịch làm !");
            return;
        }
        try {
            setLoading(true);
            yield (0, Apis_1.authApis)().post(Apis_1.endpoint.availability, {
                doctorId: user.userId,
                dayOfWeek: newAvailability.dayOfWeek,
                startTime: normalizeTime(newAvailability.startTime),
                endTime: normalizeTime(newAvailability.endTime)
            });
            react_hot_toast_1.default.success("Tạo lịch làm việc thành công!");
            setNewAvailability({ dayOfWeek: "", startTime: "", endTime: "" });
            loadAvailability();
        }
        catch (error) {
            react_hot_toast_1.default.error("Tạo lịch làm việc thất bại!");
        }
        finally {
            setLoading(false);
        }
    });
    // Sửa lịch làm việc
    const handleEdit = (item) => {
        setEditData(Object.assign(Object.assign({}, item), { endTime: item.endTime }));
        setShowEdit(true);
    };
    const handleUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
        setShowConfirm(false);
        try {
            setLoading(true);
            yield (0, Apis_1.authApis)().patch(Apis_1.endpoint.updateAvailability(editData.availabilityId), {
                doctorId: user.userId,
                endTime: normalizeTime(editData.endTime)
            });
            react_hot_toast_1.default.success("Cập nhật thành công!");
            setShowEdit(false);
            loadAvailability();
        }
        catch (err) {
            react_hot_toast_1.default.error("Cập nhật thất bại!");
        }
        finally {
            setLoading(false);
        }
    });
    return (<react_bootstrap_1.Container fluid className="p-0 mt-4 ">

            <h2 className="mb-4 text-center py-3" style={{
            background: "#f8f9fa",
            borderRadius: "12px",
            border: "1px solid #dee2e6",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
                <i className="bi bi-calendar2-week me-2" style={{ color: "#0d6efd", fontSize: 32, verticalAlign: "middle" }}></i>
                Lịch làm việc của bạn
            </h2>
            <react_bootstrap_1.Card className="mb-4 shadow">
                <react_bootstrap_1.Card.Body>
                    <react_bootstrap_1.Row className="justify-content-center align-items-center">
                        <react_bootstrap_1.Col md={2}>
                            <react_bootstrap_1.Image src={user.avatar} roundedCircle width={80} height={80}/>
                        </react_bootstrap_1.Col>
                        <react_bootstrap_1.Col>
                            <h5>{user.firstName} {user.lastName}</h5>
                            <div><strong>Email:</strong> {user.email}</div>
                        </react_bootstrap_1.Col>
                    </react_bootstrap_1.Row>
                </react_bootstrap_1.Card.Body>

            </react_bootstrap_1.Card>

            {/* Tạo lịch */}

            <react_bootstrap_1.Card className="mb-4">
                <react_bootstrap_1.Card.Body>
                    <react_bootstrap_2.Form onSubmit={handleCreate} className="row g-2 align-items-end">
                        <react_bootstrap_1.Col md={3}>
                            <react_bootstrap_2.Form.Group>
                                <react_bootstrap_2.Form.Label>Thứ</react_bootstrap_2.Form.Label>
                                <react_bootstrap_2.Form.Select value={newAvailability.dayOfWeek} onChange={e => setNewAvailability(Object.assign(Object.assign({}, newAvailability), { dayOfWeek: e.target.value }))} required>
                                    <option value="">Chọn thứ</option>
                                    {daysOfWeek.map(day => (<option key={day} value={day}>{day}</option>))}
                                </react_bootstrap_2.Form.Select>
                            </react_bootstrap_2.Form.Group>
                        </react_bootstrap_1.Col>
                        <react_bootstrap_1.Col md={3}>
                            <react_bootstrap_2.Form.Group>
                                <react_bootstrap_2.Form.Label>Giờ bắt đầu</react_bootstrap_2.Form.Label>
                                <react_bootstrap_2.Form.Control type="time" value={newAvailability.startTime} onChange={e => setNewAvailability(Object.assign(Object.assign({}, newAvailability), { startTime: e.target.value }))} required/>
                            </react_bootstrap_2.Form.Group>
                        </react_bootstrap_1.Col>
                        <react_bootstrap_1.Col md={3}>
                            <react_bootstrap_2.Form.Group>
                                <react_bootstrap_2.Form.Label>Giờ kết thúc</react_bootstrap_2.Form.Label>
                                <react_bootstrap_2.Form.Control type="time" value={newAvailability.endTime} onChange={e => setNewAvailability(Object.assign(Object.assign({}, newAvailability), { endTime: e.target.value }))} required/>
                            </react_bootstrap_2.Form.Group>
                        </react_bootstrap_1.Col>
                        <react_bootstrap_1.Col md={3}>
                            <react_bootstrap_1.Button type="submit" variant="success" className="w-100">
                                <i className="bi bi-plus-circle me-2"></i> Tạo mới
                            </react_bootstrap_1.Button>
                        </react_bootstrap_1.Col>
                    </react_bootstrap_2.Form>
                </react_bootstrap_1.Card.Body>
            </react_bootstrap_1.Card>


            {loading ? (<div className="text-center"><MySpinner_1.default /></div>) : availabilities.length === 0 ? (<react_bootstrap_1.Alert variant="info">Chưa có lịch làm việc nào!</react_bootstrap_1.Alert>) : (<react_bootstrap_1.Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Thứ</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilities.map(a => (<tr key={a.availabilityId}>
                                <td>{a.dayOfWeek}</td>
                                <td>{a.startTime}</td>
                                <td>{a.endTime}</td>
                                <td>
                                    {a.isAvailable ? (<span className="text-success">Có mặt</span>) : (<span className="text-danger">Nghỉ</span>)}
                                </td>
                                <td>{new Date(a.createdAt).toLocaleString("vi-VN")}</td>
                                <td>
                                    <react_bootstrap_1.Button variant="warning" size="sm" onClick={() => handleEdit(a)} className="me-2">
                                        <i className="bi bi-pencil-square"></i>Sửa lịch làm việc
                                    </react_bootstrap_1.Button>
                                </td>
                            </tr>))}
                    </tbody>
                </react_bootstrap_1.Table>)}

            {/* Modal sửa */}
            <react_bootstrap_1.Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
                <react_bootstrap_1.Modal.Header closeButton>
                    <react_bootstrap_1.Modal.Title>
                        <i className="bi bi-pencil-square me-2"></i>
                        Sửa lịch làm việc
                    </react_bootstrap_1.Modal.Title>
                </react_bootstrap_1.Modal.Header>
                <react_bootstrap_1.Modal.Body>
                    <react_bootstrap_2.Form>
                        <react_bootstrap_2.Form.Group className="mb-3">
                            <react_bootstrap_2.Form.Label>Giờ kết thúc mới</react_bootstrap_2.Form.Label>
                            <react_bootstrap_2.Form.Control type="time" value={editData.endTime || ""} onChange={e => setEditData(Object.assign(Object.assign({}, editData), { endTime: e.target.value }))} required/>
                        </react_bootstrap_2.Form.Group>
                    </react_bootstrap_2.Form>
                </react_bootstrap_1.Modal.Body>
                <react_bootstrap_1.Modal.Footer>
                    <react_bootstrap_1.Button variant="secondary" onClick={() => setShowEdit(false)}>
                        Hủy
                    </react_bootstrap_1.Button>
                    <react_bootstrap_1.Button variant="primary" onClick={() => setShowConfirm(true)}>
                        <i className="bi bi-check-circle me-2"></i>
                        Xác nhận sửa
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Modal.Footer>
            </react_bootstrap_1.Modal>

            {/* Modal xác nhận */}
            <react_bootstrap_1.Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <react_bootstrap_1.Modal.Header closeButton>
                    <react_bootstrap_1.Modal.Title>Xác nhận sửa lịch làm việc</react_bootstrap_1.Modal.Title>
                </react_bootstrap_1.Modal.Header>
                <react_bootstrap_1.Modal.Body>
                    Bạn có chắc chắn muốn cập nhật giờ kết thúc thành <b>{editData.endTime}</b> cho lịch làm việc này không?
                </react_bootstrap_1.Modal.Body>
                <react_bootstrap_1.Modal.Footer>
                    <react_bootstrap_1.Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </react_bootstrap_1.Button>
                    <react_bootstrap_1.Button variant="success" onClick={handleUpdate}>
                        <i className="bi bi-check-circle me-2"></i>
                        Đồng ý
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Modal.Footer>
            </react_bootstrap_1.Modal>


        </react_bootstrap_1.Container>);
};
exports.default = DoctorAvailability;
