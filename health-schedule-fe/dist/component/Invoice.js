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
const Invoice = () => {
    var _a;
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const appointment = (_a = location.state) === null || _a === void 0 ? void 0 : _a.appointment;
    const [invoice, setInvoice] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [invoiceStatus, setInvoiceStatus] = (0, react_1.useState)(null);
    const handlePaymentRedirect = () => {
        navigate("/payment-method", {
            state: {
                appointment: appointment,
                invoiceId: invoice.invoiceId,
            },
        });
    };
    (0, react_1.useEffect)(() => {
        if (!appointment) {
            console.error("Không tìm thấy appointment");
            navigate("/", { replace: true });
            return;
        }
        loadInvoice();
    }, [appointment]);
    const loadInvoice = () => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        try {
            const response = yield (0, Apis_1.authApis)().get(`invoice/${appointment.appointmentId}`);
            if (response.status !== 200) {
                throw new Error("Failed to fetch invoice data");
            }
            setInvoice(response.data);
            setInvoiceStatus(response.data.status);
        }
        catch (error) {
            console.error("Lỗi khi lấy hóa đơn:", error);
            setError("Không thể tải hóa đơn. Vui lòng thử lại sau.");
        }
        finally {
            setLoading(false);
        }
    });
    const formatDate = (timestamp) => {
        if (!timestamp)
            return "Không xác định";
        const date = new Date(timestamp);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };
    return (loading ? (<div className="text-center">
                <react_bootstrap_1.Spinner animation="border"/>
                <p>Đang tải hóa đơn...</p>
            </div>) : error ? (<div className="text-center">
                <p>{error}</p>
            </div>) : invoice ? (<div className="container mt-5">
                <h2 className="text-center mb-4">Chi Tiết Hóa Đơn</h2>
                <react_bootstrap_1.Card className="shadow-sm">
                    <react_bootstrap_1.Card.Body>
                        <h4 className="mb-3">Thông Tin Hóa Đơn</h4>
                        <react_bootstrap_1.Table bordered>
                            <tbody>
                                <tr>
                                    <th>Mã hóa đơn</th>
                                    <td>{invoice.invoiceId}</td>
                                </tr>
                                <tr>
                                    <th>Số tiền</th>
                                    <td>
                                        {invoice.amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        })}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Ngày lập hóa đơn</th>
                                    <td>{formatDate(invoice.issueDate)}</td>
                                </tr>
                                <tr>
                                    <th>Hạn thanh toán</th>
                                    <td>{formatDate(invoice.dueDate)}</td>
                                </tr>
                                <tr>
                                    <th>Trạng thái</th>
                                    <td>{invoice.status}</td>
                                </tr>
                            </tbody>
                        </react_bootstrap_1.Table>
                        {invoiceStatus && invoiceStatus === "Paid" ? (<div className="text-center mt-4">
                            <react_bootstrap_1.Button variant="primary" onClick={() => window.print()}>
                                In hóa đơn
                            </react_bootstrap_1.Button>
                        </div>) : (<div className="text-center mt-4">
                            <react_bootstrap_1.Button variant="secondary" onClick={handlePaymentRedirect}>
                                Thanh toán
                            </react_bootstrap_1.Button>
                            </div>)}
                    </react_bootstrap_1.Card.Body>
                </react_bootstrap_1.Card>
            </div>) : (<div className="text-center">
                <p>Không tìm thấy hóa đơn.</p>
            </div>));
};
exports.default = Invoice;
