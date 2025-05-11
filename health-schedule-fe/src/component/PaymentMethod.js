
import { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Styles/PaymentMethod.module.css";
import { authApis } from "../configs/Apis";
import { v4 as uuidv4 } from "uuid";
import { or } from "firebase/firestore";

const PaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState(""); // Lưu phương thức thanh toán
    const [message, setMessage] = useState(""); // Thông báo
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const appointment = location.state?.appointment;//Lay cuoc hen
    const invoiceId = location.state?.invoiceId;//Lay invoiceId
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
        if (!appointment) {
            navigate("/", { replace: true });
        }
    }, [appointment, navigate]);

    const generateTransactionId = () => {
        return `TXN-${uuidv4()}`;
    };

    const isTransactionIdUnique = async (transactionId) => {
        try {
            const response = await authApis().get(`payment-transaction/${transactionId}`);
            if (response.status === 200)
                return false
            else {
                return true
            } // API trả về true nếu mã là duy nhất
        } catch (error) {
            console.error("Lỗi khi kiểm tra mã giao dịch:", error);
            return true // Nếu có lỗi, coi như mã là duy nhất;
        }
    };

    const generateUniqueTransactionId = async () => {
        let transactionId;
        let isUnique = false;

        do {
            transactionId = generateTransactionId(); // Tạo mã giao dịch ngẫu nhiên
            isUnique = await isTransactionIdUnique(transactionId); // Kiểm tra tính duy nhất
        } while (!isUnique);
        console.log(isUnique)

        return transactionId;
    };

    //Thêm hóa đơn thanh toán
    const addPayment = async (method) => {
        setIsLoading(true);
        try {
            const transactionId = await generateUniqueTransactionId();
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
            setIsLoading(false);
            setIsSuccess(true);
        }
    }



    const handlePayment = async () => {
        if (paymentMethod === "cash") {
            let data = await addPayment("Cash");
            if (!data) {
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            }
            setMessage("Bạn đã chọn thanh toán bằng tiền mặt. Thanh toán sẽ được thu và trạng thái hóa đơn sẽ cập nhật sau khi khám xong.");
        } else if (paymentMethod === "vnpay") {
            let data = await addPayment("VNPay");
            if (!data) {
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            } else {
                console.log("Mã thanh toán VNPay:", data);
                createVNPayInvoice(invoiceId, data);
            }

        } else {
            setMessage("Vui lòng chọn phương thức thanh toán.");
        }
    };

    const createVNPayInvoice = async (invoicecID, paymentId) => {
        try {
            const orderInfo = `${invoicecID}-${paymentId}`; // Gộp invoiceId và paymentId
            // Gửi yêu cầu tạo hóa đơn VNPay (API giả định)
            const response = await authApis().get(`payment/create-vnpay-url?amount=${appointment.doctorId.consultationFee}&orderInfo=${orderInfo}`);
            if (response.data) {
                // Chuyển hướng đến trang điền thông tin thẻ
                window.location.href = response.data;
            } else {
                setMessage("Không thể tạo hóa đơn VNPay. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo hóa đơn VNPay:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" >CHỌN PHƯƠNG THỨC THANH TOÁN</h2>
            <Form>
                <Form.Group>
                    <Form.Check
                        type="radio"
                        label="Tiền mặt (Pay On Cash)"
                        name="paymentMethod"
                        value="cash"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="Thanh toán online qua VNPay (Pay Online)"
                        name="paymentMethod"
                        value="vnpay"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                </Form.Group>

                {isLoading ? (
                    <div className="text-center mt-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : !isSuccess ? (
                        <Button className="mt-3" variant="primary" onClick={handlePayment}>
                            Xác nhận
                        </Button>
                    ) : (
                        <Button className="mt-3" variant="primary" onClick={() => navigate("/")}>
                            <i className="fas fa-home">Về trang chủ </i>

                        </Button>
                    )}
            </Form>
            {message && <Alert className="mt-4" variant="info">{message}</Alert>}
        </div>
    );
};

export default PaymentMethod;