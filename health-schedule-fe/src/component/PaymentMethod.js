import { useState, useEffect } from "react";
import { Button, Form, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Styles/PaymentMethod.css";
import { authApis } from "../configs/Apis";
import { v4 as uuidv4 } from "uuid";
import momoLogo from '../assets/images/momo-logo.png';
import vnpayLogo from '../assets/images/vnpay-logo.png';

const PaymentMethod = () => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const appointment = location.state?.appointment;
    const invoiceId = location.state?.invoiceId;
    const [isSuccess, setIsSuccess] = useState(false);
    const paymentMethods = [
        {
            id: "cash",
            name: "Tiền mặt",
            description: "Thanh toán trực tiếp tại phòng khám",
            icon: "fas fa-money-bill-wave",
            color: "#28a745",
            useIcon: true
        },
        {
            id: "vnpay",
            name: "VNPay",
            description: "Thanh toán online qua VNPay",
            logo: vnpayLogo,     // Thay đổi từ icon thành logo
            color: "#005BAA",
            useIcon: false
        },
        {
            id: "momo",
            name: "MoMo",
            description: "Thanh toán qua ví điện tử MoMo",
            logo: momoLogo,      // Thay đổi từ icon thành logo
            color: "#A50064",
            useIcon: false
        }
    ];

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
            return response.status !== 200;
        } catch (error) {
            console.error("Lỗi khi kiểm tra mã giao dịch:", error);
            return true;
        }
    };

    const generateUniqueTransactionId = async () => {
        let transactionId;
        let isUnique = false;
        do {
            transactionId = generateTransactionId();
            isUnique = await isTransactionIdUnique(transactionId);
        } while (!isUnique);
        return transactionId;
    };

    const addPayment = async (method) => {
        setIsLoading(true);
        try {
            const transactionId = await generateUniqueTransactionId();
            const formData = new FormData();
            formData.append("invoiceId", invoiceId);
            formData.append("paymentMethod", method);
            formData.append("transactionId", transactionId);
            formData.append("notes", `Thanh toán qua ${method}`);
            formData.append("amount", appointment.doctorId.consultationFee);

            const response = await authApis().post("payments", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data && response.data.paymentId) {
                return response.data.paymentId;
            }
            return null;
        } catch (error) {
            console.error("Lỗi khi thêm thanh toán:", error);
            return null;
        } finally {
            setIsLoading(false);
            setIsSuccess(true);
        }
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            setMessage("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        let data;
        switch (paymentMethod) {
            case "cash":
                data = await addPayment("Cash");
                if (!data) {
                    setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                    return;
                }
                setMessage("Bạn đã chọn thanh toán bằng tiền mặt. Thanh toán sẽ được thu sau khi khám xong.");
                break;

            case "vnpay":
                data = await addPayment("VNPay");
                if (!data) {
                    setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                    return;
                }
                createVNPayInvoice(invoiceId, data);
                break;

            case "momo":
                data = await addPayment("MoMo");
                if (!data) {
                    setMessage("Không thể tạo hóa đơn. Vui lòng thử lại.");
                    return;
                }
                createMomoPayment(invoiceId, data);
                break;
        }
    };

    const createVNPayInvoice = async (invoiceId, paymentId) => {
        try {
            const orderInfo = `${invoiceId}-${paymentId}`;
            const response = await authApis().get(
                `payment/create-vnpay-url?amount=${appointment.doctorId.consultationFee}&orderInfo=${orderInfo}`
            );
            if (response.data) {
                window.location.href = response.data;
            } else {
                setMessage("Không thể tạo hóa đơn VNPay. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo hóa đơn VNPay:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    const createMomoPayment = async (invoiceId, paymentId) => {
        try {
            const orderInfo = `${invoiceId}-${paymentId}`;
            const response = await authApis().post(
                `payment/create-momo-url?amount=${appointment.doctorId.consultationFee}&orderId=${orderInfo}`
            );
            if (response.data) {
                window.location.href = response.data.payUrl;
            } else {
                setMessage("Không thể tạo thanh toán MoMo. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán MoMo:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        
        <div className="container mt-5">            
            <h2 className="text-center mb-4">CHỌN PHƯƠNG THỨC THANH TOÁN</h2>

            <div className="payment-amount text-center mb-4">
                <h4>Số tiền thanh toán</h4>
                <h3 className="text-success">
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(appointment?.doctorId?.consultationFee || 0)}
                </h3>
            </div>

            <Row className="justify-content-center">
                {paymentMethods.map((method) => (
                    <Col md={4} className="mb-4" key={method.id}>
                        <Card
                            className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod(method.id)}
                        >
                            <Card.Body className="card-body-custom">
                                {method.useIcon ? (
                                    <i
                                        className={`${method.icon} cash-icon`}
                                        style={{ color: method.color }}
                                    />
                                ) : (
                                    <img
                                        src={method.logo}
                                        alt={`${method.name} logo`}
                                        className="payment-logo"
                                    />
                                )}
                                <Card.Title className="payment-title">{method.name}</Card.Title>
                                <Card.Text className="payment-description">{method.description}</Card.Text>
                                <Form.Check
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mt-3"
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="text-center mt-4">
                {isLoading ? (
                    <Spinner animation="border" variant="primary" />
                ) : !isSuccess ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handlePayment}
                        className="px-5"
                        disabled={!paymentMethod}
                    >
                        Đồng Ý
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        size="lg"
                        onClick={() => navigate("/")}
                    >
                        <i className="fas fa-home me-2"></i>
                        Về trang chủ
                    </Button>
                )}
            </div>

            {message && (
                <Alert
                    className="mt-4 text-center"
                    variant={message.includes("thành công") ? "success" : "info"}
                >
                    {message}
                </Alert>
            )}
        </div>
    );
};

export default PaymentMethod;