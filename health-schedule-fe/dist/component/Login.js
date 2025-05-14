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
const Apis_1 = __importStar(require("../configs/Apis"));
const react_cookies_1 = __importDefault(require("react-cookies"));
const react_router_dom_1 = require("react-router-dom");
const MySpinner_1 = __importDefault(require("./layout/MySpinner"));
const MyContexts_1 = require("../configs/MyContexts");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const MyToaster_1 = require("./layout/MyToaster");
const react_router_dom_2 = require("react-router-dom");
require("./Styles/Login.css");
const Login = () => {
    var _a;
    //Phải là đối tượng rỗng
    const [user, setUser] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [msg, setMsg] = (0, react_1.useState)();
    const dispatch = (0, react_1.useContext)(MyContexts_1.MyDipatcherContext);
    const nav = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_2.useLocation)();
    const [message, setMessage] = (0, react_1.useState)(((_a = location.state) === null || _a === void 0 ? void 0 : _a.message) || "");
    (0, react_1.useEffect)(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    const info = [
        { label: "Tên đăng nhập", field: "username", type: "text" },
        { label: "Mật khẩu", field: "password", type: "password" },
    ];
    //Cập nhật value vào field vào user 
    const setState = (value, field) => {
        setUser(Object.assign(Object.assign({}, user), { [field]: value }));
    };
    const login = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            setLoading(true);
            setMsg(null);
            let res = yield Apis_1.default.post(Apis_1.endpoint['login'], Object.assign({}, user));
            react_cookies_1.default.save('token', res.data.token);
            let u = yield (0, Apis_1.authApis)().get(Apis_1.endpoint['current_user']);
            console.info(u.data);
            //Cung cấp chứng chỉ
            if (u.data.role === "Doctor" && !u.data.isActive) {
                sessionStorage.setItem("doctorId", u.data.userId); // không lưu user vì sẽ hiện header 
                (0, MyToaster_1.showCustomToast)("Tài khoản chưa được kích hoạt. Vui lòng cung cấp chứng chỉ hành nghề cho admin để kích hoạt tài khoản!");
                nav("/uploadLicense");
                return;
            }
            //Luu lai cookie chỉ khi bác sĩ đã  đc duyệt 
            react_cookies_1.default.save('user', u.data);
            //bác sĩ chưa đăng nhập không lưu context
            dispatch({
                "type": "login",
                "payload": u.data
            });
            react_hot_toast_1.default.success("Đăng nhập thành công!");
            nav("/");
        }
        catch (ex) {
            console.error("Lỗi đăng nhập:", ex);
            if (ex.response && ex.response.status === 401) {
                // Lỗi 401: Thông tin đăng nhập không hợp lệ
                setMsg("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!");
            }
            else {
                // Lỗi khác
                setMsg("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        }
        finally {
            setLoading(false);
        }
    });
    return (<react_bootstrap_1.Container fluid className="p-0">
            {message && (<div className="fade-out-message">
                    {message}
                </div>)}
            <react_bootstrap_1.Row className="justify-content-center custom-row-primary mt-4">
                <react_bootstrap_1.Col lg={6} md={4} sm={12}>
                    <h1 className="text-center text-success mb-4">ĐĂNG NHẬP</h1>
                    {msg && <react_bootstrap_1.Alert variant="danger">{msg}</react_bootstrap_1.Alert>}
                    <react_bootstrap_1.Form onSubmit={login}>

                        {/* required: Bắt buộc phải nhập trước khi submit. value theo từng field onChange set dữ liệu mới*/}
                        {info.map(f => <react_bootstrap_1.FloatingLabel key={f.field} controlId="floatingInput" label={f.label} className="mb-3">
                            <react_bootstrap_1.Form.Control type={f.type} placeholder={f.label} required vvalue={user[f.field] || ""} onChange={e => setState(e.target.value, f.field)}/>
                        </react_bootstrap_1.FloatingLabel>)}
                        {loading === true ? <MySpinner_1.default /> : <react_bootstrap_1.Button type="submit" variant="success" className="mt-1 mb-1">Đăng nhập</react_bootstrap_1.Button>}
                    </react_bootstrap_1.Form>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
        </react_bootstrap_1.Container>);
};
exports.default = Login;
