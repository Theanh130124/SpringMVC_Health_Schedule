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
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = require("../configs/Apis");
const MyContexts_1 = require("../configs/MyContexts");
const react_cookies_1 = __importDefault(require("react-cookies"));
const EditProfile = () => {
    const thisUser = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const [userData, setUserData] = (0, react_1.useState)({
        email: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.email) || "",
        firstName: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.firstName) || "",
        lastName: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.lastName) || "",
        phoneNumber: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.phoneNumber) || "",
        address: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.address) || "",
        dateOfBirth: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.dateOfBirth) || "",
        gender: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.gender) || "",
        avatar: (thisUser === null || thisUser === void 0 ? void 0 : thisUser.avatar) || null,
    });
    const [message, setMessage] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(Object.assign(Object.assign({}, userData), { [name]: value }));
    };
    const handleFileChange = (e) => {
        setUserData(Object.assign(Object.assign({}, userData), { avatar: e.target.files[0] }));
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        const formData = new FormData();
        formData.append("email", userData.email);
        formData.append("firstName", userData.firstName);
        formData.append("lastName", userData.lastName);
        formData.append("phoneNumber", userData.phoneNumber);
        formData.append("address", userData.address);
        formData.append("dateOfBirth", userData.dateOfBirth);
        formData.append("gender", userData.gender);
        if (userData.avatar) {
            formData.append("avatar", userData.avatar);
        }
        try {
            const response = yield (0, Apis_1.authApis)().patch(`user/${thisUser.username}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                navigate("/", { state: { message: "Cập nhật thông tin thành công!" } }); // Chuyển hướng về trang chủ cho gọn
            }
        }
        catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            setError("Không thể cập nhật thông tin. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
        }
    });
    return (<react_bootstrap_1.Container className="mt-5">
            <h2 className="text-center mb-4">Sửa Thông Tin Cá Nhân</h2>
            {message && <react_bootstrap_1.Alert variant="success">{message}</react_bootstrap_1.Alert>}
            {error && <react_bootstrap_1.Alert variant="danger">{error}</react_bootstrap_1.Alert>}
            <react_bootstrap_1.Form onSubmit={handleSubmit}>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Email</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="email" name="email" value={userData.email} onChange={handleInputChange} disabled/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Họ</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} required/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Tên</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} required/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Số điện thoại</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleInputChange} required/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Địa chỉ</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="text" name="address" value={userData.address} onChange={handleInputChange} required/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Ngày sinh</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="date" name="dateOfBirth" value={userData.dateOfBirth} onChange={handleInputChange} required/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Giới tính</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Select name="gender" value={userData.gender} onChange={handleInputChange} required>
                                <option value="">Chọn giới tính</option>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                                <option value="Other">Khác</option>
                            </react_bootstrap_1.Form.Select>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                    <react_bootstrap_1.Col md={6}>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Ảnh đại diện</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="file" name="avatar" onChange={handleFileChange}/>
                        </react_bootstrap_1.Form.Group>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
                {loading ? (<div className="text-center mb-3"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>) : (<div className="text-center">
                        <react_bootstrap_1.Button variant="primary" type="submit">
                            Lưu thay đổi
                        </react_bootstrap_1.Button>
                    </div>)}
            </react_bootstrap_1.Form>
        </react_bootstrap_1.Container>);
};
exports.default = EditProfile;
