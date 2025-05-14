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
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = __importStar(require("../configs/Apis"));
const react_bootstrap_1 = require("react-bootstrap");
const MySpinner_1 = __importDefault(require("./layout/MySpinner"));
const react_cookies_1 = __importDefault(require("react-cookies"));
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const UploadLicense = () => {
    // Nên thêm hình ảnh chứng chỉ
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [msg, setMsg] = (0, react_1.useState)("");
    const [license, setLicense] = (0, react_1.useState)({});
    const nav = (0, react_router_dom_1.useNavigate)();
    //Lấy id trong sessionStorage
    const doctorId = sessionStorage.getItem("doctorId");
    const info = [
        { label: "Số chứng chỉ hành nghề", field: "licenseNumber", type: "text" },
        { label: "Ngày cấp", field: "issuedDate", type: "date" },
        { label: "Ngày hết hạn", field: "expiryDate", type: "date" },
        { label: "Cơ quan cấp", field: "issuingAuthority", type: "text" },
        { label: "Chuyên môn làm việc", field: "scopeDescription", type: "text" },
    ];
    const setState = (value, field) => {
        setLicense(Object.assign(Object.assign({}, license), { [field]: value }));
    };
    //Thêm thông báo 
    const upload = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        try {
            //Bên kia đã lưu token vào cookie
            setLoading(true);
            let res = yield (0, Apis_1.authApis)().post(Apis_1.endpoint['doctor_license'], Object.assign(Object.assign({}, license), { "doctorId": doctorId }));
            react_hot_toast_1.default.success("Chứng chỉ hành nghề đã gửi thành công , vui lòng chờ duyệt!");
            sessionStorage.removeItem("doctorId");
            react_cookies_1.default.remove('token');
            nav("/login");
        }
        catch (ex) {
            console.error(ex);
            setMsg(`Có lỗi xảy ra. Vui lòng thử lại! ${ex}`);
        }
        finally {
            setLoading(false);
        }
    });
    // Gửi 1 lần rồi phải chờ duyệt
    return (<react_bootstrap_1.Container fluid className="p-0">
            <react_bootstrap_1.Row className="justify-content-center custom-row-primary mt-4">
                <react_bootstrap_1.Col lg={6} md={4} sm={12}>
                    <h1 className="text-center text-success mb-4">CUNG CẤP CHỨNG CHỈ HÀNH NGHỀ</h1>
                    {msg && <react_bootstrap_1.Alert variant="danger">{msg}</react_bootstrap_1.Alert>}
                    <react_bootstrap_1.Form onSubmit={upload}>
                        {info.map(l => <react_bootstrap_1.FloatingLabel key={l.field} label={l.label} className="mb-3">

                            <react_bootstrap_1.Form.Control type={l.type} placeholder={l.label} required value={license[l.field]} onChange={e => setState(e.target.value, l.field)}/>

                        </react_bootstrap_1.FloatingLabel>)}
                        {loading === true ? <MySpinner_1.default /> : <react_bootstrap_1.Button type="submit" className="btn btn-success mt-1 mb-1">Gửi chứng chỉ</react_bootstrap_1.Button>}


                    </react_bootstrap_1.Form>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
        </react_bootstrap_1.Container>);
};
exports.default = UploadLicense;
