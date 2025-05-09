
import { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Styles/PaymentMethod.css";
import { authApis } from "../configs/Apis";
import cookie from 'react-cookies'


const PaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState(""); // Lưu phương thức thanh toán
    const [message, setMessage] = useState(""); // Thông báo
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [invoiceId, setInvoiceId] = useState(null); // Lưu invoiceId

    const appointment = location.state?.appointment;//Lay cuoc hen
    useEffect(() => {
        if (!appointment) {
            navigate("/", { replace: true });
        }
    }, [appointment, navigate]);

    //Them hoa don truoc khi tao hoa don VNPay
    const addInvoice = async () => {
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];

            // Tạo đối tượng FormData
            const formData = new FormData();
            formData.append("amount", appointment.doctorId.consultationFee);
            formData.append("dueDate", today);
            formData.append("appointmentId", appointment.appointmentId);

            // Gửi yêu cầu với FormData
            const response = await authApis().post(`invoice`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Đặt header cho form-data
                },
            });

            if (response.data) {
                return response.data.invoiceId;          
            }
            else {
                setMessage("Không thể tạo hóa đơn . Vui lòng thử lại.");
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi tạo hóa đơn:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }

    const handlePayment = async() => {
        if (paymentMethod === "cash") {
            const invoiceId =  await addInvoice();
            if(!invoiceId){
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            };
            setMessage("Bạn đã chọn thanh toán bằng tiền mặt. Thanh toán sẽ được thu sau khi khám xong.");
        } else if (paymentMethod === "vnpay") {
           const invoiceId = await addInvoice();
           if(!invoiceId){
                setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                return;
            }else{
                createVNPayInvoice(invoiceId);
            }
            
        } else {
            setMessage("Vui lòng chọn phương thức thanh toán.");
        }
    };

    const createVNPayInvoice = async (invoicecID) => {    
        try {
            // Gửi yêu cầu tạo hóa đơn VNPay (API giả định)
            const response = await authApis().get(`payment/create-vnpay-url?amount=${appointment.doctorId.consultationFee}&orderInfo=${invoicecID}`);
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
                <Button className="mt-3" variant="primary" onClick={handlePayment}>
                    Xác nhận
                </Button>
            </Form>
            {message && <Alert className="mt-4" variant="info">{message}</Alert>}
        </div>
    );
};

export default PaymentMethod;