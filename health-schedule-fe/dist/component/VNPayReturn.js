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
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const Apis_1 = require("../configs/Apis");
const VNPayReturn = () => {
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loading, setLoading] = (0, react_1.useState)(true); // Trạng thái loading
    const [paymentStatus, setPaymentStatus] = (0, react_1.useState)(null); // Trạng thái thanh toán
    const [paymentData, setPaymentData] = (0, react_1.useState)({}); // Dữ liệu thanh toán
    (0, react_1.useEffect)(() => {
        const processPayment = () => __awaiter(void 0, void 0, void 0, function* () {
            // Lấy query string từ URL
            const queryParams = new URLSearchParams(location.search);
            // Lấy các tham số từ query string
            const vnp_Amount = queryParams.get("vnp_Amount");
            const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            const vnp_OrderInfo = queryParams.get("vnp_OrderInfo"); //OrderInfo la invoiceId
            const [invoiceId, paymentId] = vnp_OrderInfo.split("-"); // Tách invoiceId và paymentId 
            const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
            const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
            // Lưu dữ liệu thanh toán vào state
            setPaymentData({
                vnp_Amount,
                vnp_ResponseCode,
                vnp_OrderInfo,
                vnp_TransactionNo,
                vnp_TransactionStatus,
                paymentId,
                invoiceId,
            });
            const updateInvoiceStatus = (status) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const response = yield (0, Apis_1.authApis)().post(`invoice/${invoiceId}`, {
                        status: status, // Cập nhật trạng thái thanh toán
                    });
                    if (response.status === 200) {
                        console.log("Cập nhật trạng thái hóa đơn thành công");
                    }
                }
                catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
                }
            });
            const updatePaymentStatus = (statuss) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(paymentId);
                try {
                    const response = yield (0, Apis_1.authApis)().patch(`payments/${paymentId}`, {
                        status: statuss,
                        transactionId: vnp_TransactionNo,
                    });
                    if (response.status === 200) {
                        console.log("Cập nhật trạng thái thanh toán thành công");
                    }
                }
                catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
                }
            });
            // Kiểm tra mã phản hồi từ VNPay
            if (vnp_ResponseCode === "00") {
                setPaymentStatus("success"); // Thanh toán thành công
                // Gọi API để cập nhật trạng thái thanh toán của hóa đơnđơn
                yield updateInvoiceStatus("Paid");
                // Cập nhật trạng thái thanh toán
                yield updatePaymentStatus("Completed");
            }
            else {
                setPaymentStatus("failure"); // Thanh toán thất bại
                yield updateInvoiceStatus("'Cancelled'");
                // Cập nhật trạng thái thanh toán
                yield updatePaymentStatus("Failed");
            }
            setLoading(false); // Kết thúc loading
        });
        processPayment(); // Gọi hàm xử lý thanh toán
    }, [location.search]);
    const handleBackToHome = () => {
        navigate("/"); // Chuyển hướng về trang chủ
    };
    return (<div className="container mt-5">
            <h1 className="text-center mb-4">Kết Quả Thanh Toán</h1>

            {loading ? (<div className="text-center">
                    <react_bootstrap_1.Spinner animation="border"/>
                    <p>Đang xử lý kết quả thanh toán...</p>
                </div>) : paymentStatus === "success" ? (<react_bootstrap_1.Alert variant="success" className="text-center">
                    <h4>Thanh toán thành công!</h4>
                    <p>
                        Số tiền: {(paymentData.vnp_Amount / 100).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            })}
                    </p>
                    <p>Mã giao dịch: {paymentData.vnp_TransactionNo}</p>
                    <p>Thông tin đơn hàng: {paymentData.invoiceId}</p>
                    <react_bootstrap_1.Button variant="primary" onClick={handleBackToHome}>
                        Quay về trang chủ
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Alert>) : (<react_bootstrap_1.Alert variant="danger" className="text-center">
                    <h4>Thanh toán thất bại!</h4>
                    <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                    <react_bootstrap_1.Button variant="primary" onClick={handleBackToHome}>
                        Quay về trang chủ
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Alert>)}
        </div>);
};
exports.default = VNPayReturn;
