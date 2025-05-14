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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const Apis_1 = require("../configs/Apis");
const MyContexts_1 = require("../configs/MyContexts");
const MyContexts_2 = require("../configs/MyContexts");
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = (0, react_1.useState)("");
    const [newPassword, setNewPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [message, setMessage] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const thisUser = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const dispatch = (0, react_1.useContext)(MyContexts_2.MyDipatcherContext);
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        setMessage("");
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("currentPassword", currentPassword);
            formData.append("newPassword", newPassword);
            const response = yield (0, Apis_1.authApis)().patch(`user/change-password/${thisUser.username}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            if (response.data.success === true) {
                setMessage(response.data.message);
                dispatch({ type: "logout" });
                navigate("/login", { state: { message: "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!" } });
            }
            else {
                setError(response.data.message);
            }
        }
        catch (error) {
            console.error("Lỗi khi thay đổi mật khẩu:", error);
            setError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Không thể thay đổi mật khẩu. Vui lòng thử lại.");
        }
        finally {
            setLoading(false);
        }
    });
    return (<react_bootstrap_1.Container className="mt-5">
            <h2 className="text-center mb-4">Thay Đổi Mật Khẩu</h2>
            {message && <react_bootstrap_1.Alert variant="success">{message}</react_bootstrap_1.Alert>}
            {error && <react_bootstrap_1.Alert variant="danger">{error}</react_bootstrap_1.Alert>}
            <react_bootstrap_1.Form onSubmit={handleSubmit}>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={6} className="offset-md-3">
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Mật khẩu hiện tại</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="password" placeholder="Nhập mật khẩu hiện tại" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required/>
                        </react_bootstrap_1.Form.Group>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Mật khẩu mới</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="password" placeholder="Nhập mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                        </react_bootstrap_1.Form.Group>
                        <react_bootstrap_1.Form.Group className="mb-3">
                            <react_bootstrap_1.Form.Label>Xác nhận mật khẩu mới</react_bootstrap_1.Form.Label>
                            <react_bootstrap_1.Form.Control type="password" placeholder="Xác nhận mật khẩu mới" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                        </react_bootstrap_1.Form.Group>
                        <div className="text-center">
                            {loading ? (<div className="text-center mb-3"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></div>) : (<react_bootstrap_1.Button variant="primary" type="submit">
                                    Thay đổi mật khẩu
                                </react_bootstrap_1.Button>)}

                        </div>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
            </react_bootstrap_1.Form>
        </react_bootstrap_1.Container>);
};
exports.default = ChangePassword;
