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
const react_1 = require("react");
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
require("./Styles/PaymentMethod.module.css");
const Apis_1 = require("../configs/Apis");
const uuid_1 = require("uuid");
const firestore_1 = require("firebase/firestore");
const PaymentMethod = () => {
    var _a, _b;
    const [paymentMethod, setPaymentMethod] = (0, react_1.useState)(""); // Lưu phương thức thanh toán
    const [message, setMessage] = (0, react_1.useState)(""); // Thông báo
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const location = (0, react_router_dom_1.useLocation)();
    const appointment = (_a = location.state) === null || _a === void 0 ? void 0 : _a.appointment; //Lay cuoc hen
    const invoiceId = (_b = location.state) === null || _b === void 0 ? void 0 : _b.invoiceId; //Lay invoiceId
    const [isSuccess, setIsSuccess] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!appointment) {
            navigate("/", { replace: true });
        }
    }, [appointment, navigate]);
    const generateTransactionId = () => {
        return `TXN-${(0, uuid_1.v4)()}`;
    };
    const isTransactionIdUnique = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, Apis_1.authApis)().get(`payment-transaction/${transactionId}`);
            if (response.status === 200)
                return false;
            else {
                return true;
            } // API trả về true nếu mã là duy nhất
        }
        catch (error) {
            console.error("Lỗi khi kiểm tra mã giao dịch:", error);
            return true; // Nếu có lỗi, coi như mã là duy nhất;
        }
    });
    const generateUniqueTransactionId = () => __awaiter(void 0, void 0, void 0, function* () {
        let transactionId;
        let isUnique = false;
        do {
            transactionId = generateTransactionId(); // Tạo mã giao dịch ngẫu nhiên
            isUnique = yield isTransactionIdUnique(transactionId); // Kiểm tra tính duy nhất
        } while (!isUnique);
        console.log(isUnique);
        return transactionId;
    });
    //Thêm hóa đơn thanh toán
    const addPayment = (method) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        try {
            const transactionId = yield generateUniqueTransactionId();
            console.log("Mã giao dịch duy nhất:", transactionId);
            const formData = new FormData();
            formData.append("invoiceId", invoiceId);
            formData.append("paymentMethod", method);
            let notes = "Thanh toán tiền mặt";
            if (method === "VNPay") {
                notes = "Thanh toán qua VNPay";
            }
            formData.append("transactionId", transactionId);
            formData.append("notes", notes);
            formData.append("amount", appointment.doctorId.consultationFee);
            const response = yield (0, Apis_1.authApis)().post(`payments`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Đặt header cho form-data
                },
            });
            if (response.data && response.data.paymentId) {
                return response.data.paymentId;
            }
            else {
                console.error("Không thể thêm thanh toán. Dữ liệu trả về không hợp lệ.");
                return null;
            }
        }
        catch (error) {
            console.error("Lỗi khi thêm thanh toán:", error);
            return null;
        }
        finally {
            setIsLoading(false);
            setIsSuccess(true);
        }
    });
    const handlePayment = () => __awaiter(void 0, void 0, void 0, function* () {
        if (paymentMethod === "cash") {
            let data = yield addPayment("Cash");
            if (!data) {
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            }
            setMessage("Bạn đã chọn thanh toán bằng tiền mặt. Thanh toán sẽ được thu và trạng thái hóa đơn sẽ cập nhật sau khi khám xong.");
        }
        else if (paymentMethod === "vnpay") {
            let data = yield addPayment("VNPay");
            if (!data) {
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            }
            else {
                console.log("Mã thanh toán VNPay:", data);
                createVNPayInvoice(invoiceId, data);
            }
        }
        else {
            setMessage("Vui lòng chọn phương thức thanh toán.");
        }
    });
    const createVNPayInvoice = (invoicecID, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const orderInfo = `${invoicecID}-${paymentId}`; // Gộp invoiceId và paymentId
            // Gửi yêu cầu tạo hóa đơn VNPay (API giả định)
            const response = yield (0, Apis_1.authApis)().get(`payment/create-vnpay-url?amount=${appointment.doctorId.consultationFee}&orderInfo=${orderInfo}`);
            if (response.data) {
                // Chuyển hướng đến trang điền thông tin thẻ
                window.location.href = response.data;
            }
            else {
                setMessage("Không thể tạo hóa đơn VNPay. Vui lòng thử lại.");
            }
        }
        catch (error) {
            console.error("Lỗi khi tạo hóa đơn VNPay:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    });
    return (<div className="container mt-5">
            <h2 className="text-center mb-4">CHỌN PHƯƠNG THỨC THANH TOÁN</h2>
            <react_bootstrap_1.Form>
                <react_bootstrap_1.Form.Group>
                    <react_bootstrap_1.Form.Check type="radio" label="Tiền mặt (Pay On Cash)" name="paymentMethod" value="cash" onChange={(e) => setPaymentMethod(e.target.value)}/>
                    <react_bootstrap_1.Form.Check type="radio" label="Thanh toán online qua VNPay (Pay Online)" name="paymentMethod" value="vnpay" onChange={(e) => setPaymentMethod(e.target.value)}/>
                </react_bootstrap_1.Form.Group>

                {isLoading ? (<div className="text-center mt-4">
                        <react_bootstrap_1.Spinner animation="border" variant="primary"/>
                    </div>) : !isSuccess ? (<react_bootstrap_1.Button className="mt-3" variant="primary" onClick={handlePayment}>
                            Xác nhận
                        </react_bootstrap_1.Button>) : (<react_bootstrap_1.Button className="mt-3" variant="primary" onClick={() => navigate("/")}>
                            <i className="fas fa-home">Về trang chủ </i>

                        </react_bootstrap_1.Button>)}
            </react_bootstrap_1.Form>
            {message && <react_bootstrap_1.Alert className="mt-4" variant="info">{message}</react_bootstrap_1.Alert>}
        </div>);
};
exports.default = PaymentMethod;
