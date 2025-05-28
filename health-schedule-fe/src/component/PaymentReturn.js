import { useLocation, useNavigate } from "react-router-dom";
import { use, useContext, useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { authApis } from "../configs/Apis";
import { MyUserContext } from "../configs/MyContexts";

const VNPayReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
    const [paymentData, setPaymentData] = useState({}); // Dữ liệu thanh toán
    const user = useContext(MyUserContext); // Lấy thông tin người dùng từ context
    useEffect(() => {
        const processPayment = async () => {
            const queryParams = new URLSearchParams(location.search);

            const isVNPay = queryParams.has("vnp_Amount");
            const isMoMo = queryParams.has("amount") && queryParams.has("orderId");

            if (isVNPay) {

                // ==== Xử lý VNPay ====
                const vnp_Amount = queryParams.get("vnp_Amount");
                const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
                const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
                const [invoiceId, paymentId] = vnp_OrderInfo.split("-");
                const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
                const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
                const amount = parseInt(vnp_Amount) / 100;
                await setPaymentData({
                    amount: amount,
                    transactionId: vnp_TransactionNo,
                    invoiceId: invoiceId,
                    paymentId: paymentId,
                    gateway: "VNPay",
                });


                if (vnp_ResponseCode === "00") {
                    setPaymentStatus("success");
                    await updateInvoiceStatus("Paid", invoiceId);
                    await updatePaymentStatus("Completed", paymentId, vnp_TransactionNo);
                    await sendMailSuccess(user.email, user.firstName, user.lastName, vnp_Amount, vnp_TransactionNo);
                } else {
                    setPaymentStatus("failure");
                    await updateInvoiceStatus("Cancelled", invoiceId);
                    await updatePaymentStatus("Failed", paymentId, vnp_TransactionNo);
                }
            } else if (isMoMo) {
                // ==== Xử lý MoMo ====
                const amount = queryParams.get("amount");
                const resultCode = queryParams.get("resultCode");
                const orderId = queryParams.get("orderId"); // orderId là invoiceId-paymentId 
                const transId = queryParams.get("transId");

                const [invoiceId, paymentId] = orderId.split("-");
                const numericAmount = parseInt(amount);
                setPaymentData({
                    amount: numericAmount,
                    transactionId: transId,
                    invoiceId: invoiceId,
                    paymentId: paymentId,
                    gateway: "MoMo",
                });

                if (resultCode === "0") {
                    setPaymentStatus("success");
                    /*await updateInvoiceStatus("Paid", invoiceId);
                    await updatePaymentStatus("Completed", paymentId, transId);
                    await sendMailSuccess(user.email, user.firstName, user.lastName, amount, transId);               
                */
                    } else {
                    setPaymentStatus("failure");                   
                    /*await updateInvoiceStatus("Cancelled", invoiceId);
                    await updatePaymentStatus("Failed", paymentId, transId);
                    */
                }
            } else {
                setPaymentStatus("failure");
            }

            setLoading(false);
        };

        const updateInvoiceStatus = async (status, invoiceId) => {
            try {
                await authApis().post(`invoice/${invoiceId}`, { status: status });
            } catch (e) {
                console.error("Lỗi cập nhật hóa đơn", e);
            }
        };

        const updatePaymentStatus = async (status, paymentId, transactionId) => {
            try {
                await authApis().patch(`payments/${paymentId}`, {
                    status: status,
                    transactionId: transactionId,
                });
            } catch (e) {
                console.error("Lỗi cập nhật thanh toán", e);
            }
        };

        const sendMailSuccess = async (email, firstName, lastName, amount, transactionId) => {
            try {
                const formData = new FormData();
                formData.append("email", email);
                formData.append("patientName", `${firstName} ${lastName}`);
                formData.append("amount", amount);
                formData.append("transactionId", transactionId);
                await authApis().post(`/payment/send-mail`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch (error) {
                console.error("Gửi email thất bại", error);
            }
        };

        processPayment();
    }, [location.search]);


    const handleBackToHome = () => {
        navigate("/"); // Chuyển hướng về trang chủ
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Kết Quả Thanh Toán</h1>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Đang xử lý kết quả thanh toán...</p>
                </div>
            ) : paymentStatus === "success" ? (
                <Alert variant="success" className="text-center">
                    <h4>Thanh toán thành công!</h4>
                    <p>
                        Số tiền: {Number(paymentData.amount).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </p>
                    <p>Mã giao dịch: {paymentData.transactionId}</p>
                    <p>Thông tin đơn hàng: {paymentData.invoiceId}</p>
                    <p>Cổng thanh toán: {paymentData.gateway}</p>
                    <Button variant="primary" onClick={handleBackToHome}>
                        Quay về trang chủ
                    </Button>
                </Alert>
            ) : (
                <Alert variant="danger" className="text-center">
                    <h4>Thanh toán thất bại!</h4>
                    <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
                    <Button variant="primary" onClick={handleBackToHome}>
                        Quay về trang chủ
                    </Button>
                </Alert>
            )}
        </div>
    );
};

export default VNPayReturn;