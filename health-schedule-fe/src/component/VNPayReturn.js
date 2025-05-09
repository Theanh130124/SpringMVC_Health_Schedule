import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { authApis } from "../configs/Apis";

const VNPayReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
    const [paymentData, setPaymentData] = useState({}); // Dữ liệu thanh toán

    useEffect(() => {
        const processPayment = async () => {
            // Lấy query string từ URL
            const queryParams = new URLSearchParams(location.search);

            // Lấy các tham số từ query string
            const vnp_Amount = queryParams.get("vnp_Amount");
            const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");//OrderInfo la invoiceId
            const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
            const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");

            // Lưu dữ liệu thanh toán vào state
            setPaymentData({
                vnp_Amount,
                vnp_ResponseCode,
                vnp_OrderInfo,
                vnp_TransactionNo,
                vnp_TransactionStatus,
            });

            const updateInvoiceStatus = async (status) => {
                try {

                    const response = await authApis().post(`invoice/${vnp_OrderInfo}`, {
                        status: status, // Cập nhật trạng thái thanh toán
                    });

                    if (response.status === 200) {
                        console.log("Cập nhật trạng thái hóa đơn thành công");
                    }
                }
                catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
                }
            }

            const addPayment = async () => {
                setLoading(true);
                try {
                    const vnp_Amount = parseInt(queryParams.get("vnp_Amount"), 10); // Chuyển đổi sang số nguyên
                    const amount = vnp_Amount / 100; // Chuyển đổi sang số tiền thực tế
                    const formData = new FormData();
                    formData.append("invoiceId", vnp_OrderInfo);
                    formData.append("paymentMethod", 'VNPay');
                    formData.append("transactionId", vnp_TransactionNo);
                    formData.append("notes", "Thanh toán qua VNPay");
                    formData.append("amount", amount);

                    const response = await authApis().post(`payments`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data", // Đặt header cho form-data
                        },
                    });

                    if (response.data && response.data.paymentId) {
                        return response.data.paymentId;
                    } else {
                        console.error("Không thể thêm thanh toán. Dữ liệu trả về không hợp lệ.");
                        return null;
                    }
                }
                catch (error) {
                    console.error("Lỗi khi thêm thanh toán:", error);
                    return null;
                }
                finally {
                    setLoading(false);
                }
            }

            const updatePaymentStatus = async (paymentId, statuss) => {
                console.log("paymentId", paymentId);
                console.log("statuss", statuss);
                try {
                    const response = await authApis().patch(`payments/${paymentId}`, {
                        status: statuss,
                        transactionId: vnp_TransactionNo,
                    });

                    if (response.status === 200) {
                        console.log("Cập nhật trạng thái thanh toán thành công");
                    }
                } catch (error) {
                    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
                }
            };

            // Kiểm tra mã phản hồi từ VNPay
            if (vnp_ResponseCode === "00") {
                setPaymentStatus("success"); // Thanh toán thành công
                // Gọi API để cập nhật trạng thái thanh toán của hóa đơnđơn
                await updateInvoiceStatus("Paid");
                // Thêm dữ liệu vào bảng Payment
                let paymentId = await addPayment();

                // Cập nhật trạng thái thanh toán
                await updatePaymentStatus(paymentId, "Completed");

            } else {
                setPaymentStatus("failure"); // Thanh toán thất bại
                await updateInvoiceStatus("'Cancelled'");
                // Thêm dữ liệu vào bảng Payment
                let paymentId = await addPayment();

                // Cập nhật trạng thái thanh toán
                await updatePaymentStatus(paymentId, "Failed");
            }

            setLoading(false); // Kết thúc loading
        }
        processPayment(); // Gọi hàm xử lý thanh toán
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
                        Số tiền: {(paymentData.vnp_Amount / 100).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </p>
                    <p>Mã giao dịch: {paymentData.vnp_TransactionNo}</p>
                    <p>Thông tin đơn hàng: {paymentData.vnp_OrderInfo}</p>
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