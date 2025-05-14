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
// FloatingLabel form nhập vào thì placeholder sẽ lên trên
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = __importStar(require("../configs/Apis"));
const MySpinner_1 = __importDefault(require("./layout/MySpinner"));
const Register = () => {
    const info = [
        { title: "Họ và tên lót", field: "lastName", type: "text" },
        { title: "Tên", field: "firstName", type: "text" },
        { title: "Tên đăng nhập", field: "username", type: "text" },
        { title: "Mật khẩu", field: "password", type: "password" },
        { title: "Xác nhận mật khẩu", field: "confirm", type: "password" },
        { title: "Địa chỉ Email", field: "email", type: "email" },
        { title: "Số điện thoại", field: "phone", type: "text" },
        { title: "Địa chỉ", field: "address", type: "text" },
        {
            title: "Giới tính", field: "gender", type: "select", options: [
                { label: "Nam", value: "Male" },
                { label: "Nữ", value: "Female" }
            ]
        },
        { title: "Ngày sinh", field: "birthday", type: "date" },
        { title: "Lịch sử bệnh", field: "medicalHistory", type: "text" },
    ];
    const [user, setUser] = (0, react_1.useState)({});
    const avatar = (0, react_1.useRef)();
    const [msg, setMsg] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [step, setStep] = (0, react_1.useState)(1);
    const nav = (0, react_router_dom_1.useNavigate)();
    // const formRef = useRef(); // -> tham chiếu tới Form để các thành phần này đều như 1 form
    const setState = (value, field) => {
        setUser(Object.assign(Object.assign({}, user), { [field]: value }));
    };
    const register = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!user.role) {
            setUser(Object.assign(Object.assign({}, user), { role: "Patient" }));
        }
        if (user.password !== user.confirm) {
            setMsg("Mật khẩu không khớp");
        }
        else {
            let form = new FormData();
            for (let key in user) {
                if (key !== 'confirm')
                    form.append(key, user[key]);
            }
            if (avatar.current && avatar.current.files && avatar.current.files.length > 0) {
                form.append("avatar", avatar.current.files[0]);
            }
            try {
                setLoading(true);
                yield Apis_1.default.post(Apis_1.endpoint['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                nav("/login"); // đk thành công về đăng nhập
            }
            catch (ex) {
                console.error(ex);
                setMsg(`Đã có lỗi xảy ra ${ex}`);
            }
            finally {
                setLoading(false);
            }
        }
    });
    (0, react_1.useEffect)(() => {
        if (msg) {
            const timer = setTimeout(() => {
                setMsg(null);
            }, 5000); // Thời gian hiển thị 5 giây
            return () => clearTimeout(timer);
        }
    }, [msg]);
    return (<>
            {/* Check validate -> làm thêm con mắt xem pass */}
            <react_bootstrap_1.Container fluid className="p-0">
                <react_bootstrap_1.Row className="justify-content-center custom-row-primary mt-4">
                    <react_bootstrap_1.Col lg={6} md={4} sm={12}>
                        <react_bootstrap_1.Image src="/assets/images/login-banner.png" alt="banner" className="mt-5 ms-3"/>
                        <p className="text-center mt-3 text-muted me-5" style={{ fontSize: "1.5rem", color: "#007bff", fontWeight: "bold" }}>" Đội ngũ bác sĩ tận tâm với bệnh nhân, luôn sẵn sàng hỗ trợ bạn trong hành trình chăm sóc sức khỏe."</p>

                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col lg={5} md={6} sm={12}>
                        <react_bootstrap_1.Container className="p-3 shadow rounded bg-light me-5">
                            <h1 className="text-center text-success mb-4">ĐĂNG KÝ</h1>
                            {msg && <react_bootstrap_1.Alert variant="danger">{msg}</react_bootstrap_1.Alert>}
                            <react_bootstrap_1.Form onSubmit={register}>
                                <react_bootstrap_1.Row>
                                    {/* Cột đầu tiên */}
                                    <react_bootstrap_1.Col lg={6} md={6} sm={12}>
                                        {info.slice(0, Math.ceil(info.length / 2)).map((i, index) => (<div key={i.field} className="mb-3">
                                                {i.type === "select" ? (<react_bootstrap_1.Form.Select value={user[i.field] || ''} required onChange={e => setState(e.target.value, i.field)}>
                                                        <option value="">-- {i.title} --</option>
                                                        {i.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                                    </react_bootstrap_1.Form.Select>) : (<react_bootstrap_1.FloatingLabel controlId={`floating-${i.field}`} label={i.title}>
                                                        <react_bootstrap_1.Form.Control type={i.type} placeholder={i.title} required value={user[i.field] || ''} onChange={e => setState(e.target.value, i.field)}/>
                                                    </react_bootstrap_1.FloatingLabel>)}
                                            </div>))}
                                    </react_bootstrap_1.Col>

                                    {/* Cột thứ hai */}
                                    <react_bootstrap_1.Col lg={6} md={6} sm={12}>
                                        {info.slice(Math.ceil(info.length / 2)).map((i, index) => (<div key={i.field} className="mb-3">
                                                {i.type === "select" ? (<react_bootstrap_1.Form.Select value={user[i.field] || ''} required onChange={e => setState(e.target.value, i.field)}>
                                                        <option value="">-- {i.title} --</option>
                                                        {i.options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                                                    </react_bootstrap_1.Form.Select>) : (<react_bootstrap_1.FloatingLabel controlId={`floating-${i.field}`} label={i.title}>
                                                        <react_bootstrap_1.Form.Control type={i.type} placeholder={i.title} required value={user[i.field] || ''} onChange={e => setState(e.target.value, i.field)}/>
                                                    </react_bootstrap_1.FloatingLabel>)}
                                            </div>))}
                                    </react_bootstrap_1.Col>
                                </react_bootstrap_1.Row>
                                <react_bootstrap_1.Row>
                                    <react_bootstrap_1.Col lg={12} className="mb-3">
                                        <react_bootstrap_1.Form.Control ref={avatar} type="file" placeholder="Ảnh đại diện"/>
                                    </react_bootstrap_1.Col>
                                </react_bootstrap_1.Row>
                                <react_bootstrap_1.Button type="submit" variant="success" className="mt-3 w-100" disabled={loading}>
                                    {loading ? <MySpinner_1.default /> : "Đăng ký"}
                                </react_bootstrap_1.Button>
                            </react_bootstrap_1.Form>
                        </react_bootstrap_1.Container>
                    </react_bootstrap_1.Col>


                </react_bootstrap_1.Row>
            </react_bootstrap_1.Container>
        </>);
};
exports.default = Register;
