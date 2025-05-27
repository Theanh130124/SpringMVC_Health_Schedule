import React, { useState, useEffect } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { authApis } from "../configs/Apis";
import "./Styles/Invoice.css";

const Invoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const appointment = location.state?.appointment;
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const getStatusClass = (status) => {
        return status === "Paid" ? "status-paid" : "status-pending";
    };
    const handlePaymentRedirect = () => {
        navigate("/payment-method", {
            state: {
                appointment: appointment,
                invoiceId: invoice.invoiceId,
            },
        });
    }


    useEffect(() => {
        if (!appointment) {
            console.error("Không tìm thấy appointment");
            navigate("/", { replace: true });
            return;
        }
        loadInvoice();
    }, [appointment]);

    const loadInvoice = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApis().get(`invoice/${appointment.appointmentId}`);

            if (response.status !== 200) {
                throw new Error("Failed to fetch invoice data");
            }
            setInvoice(response.data);
            const payment = await loadPaymentMethod(response.data.invoiceId);
            setInvoiceStatus(response.data.status);
            if (payment) {
                setPaymentMethod(payment)
            }
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn:", error);
            setError("Không thể tải hóa đơn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentMethod = async (invoiceId) => {
        try {
            const response = await authApis().get(`payment/${invoiceId}`);
            if (response.status === 200 && response.data) {
                return response.data
            }
            return null
        } catch (error) {
            console.error("Lỗi khi lấy phương thức thanh toán:", error);
            return null;
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "Không xác định";
        const date = new Date(timestamp);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        loading ? (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                <p className="loading-text">Đang tải hóa đơn...</p>
            </div>
        ) : error ? (
            <div className="loading-container">
                <p className="text-danger">{error}</p>
            </div>
        ) : invoice ? (
            <div className="invoice-container">
                <h2 className="invoice-header">Chi Tiết Hóa Đơn</h2>
                <Card className="invoice-card">
                    <Card.Body>
                        <h4 className="invoice-title">Thông Tin Thanh Toán</h4>
                        <Table bordered hover className="invoice-table">
                            <tbody>
                                <tr>
                                    <th>Mã hóa đơn</th>
                                    <td>{invoice.invoiceId}</td>
                                </tr>
                                <tr>
                                    <th>Số tiền</th>
                                    <td className="invoice-amount">
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
                                    <td>
                                        <span className={`invoice-status ${getStatusClass(invoice.status)}`}>
                                            {invoice.status === "Paid" ? "Đã hoàn thành" : "Đang chờ"}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Phương thức thanh toán</th>
                                    <td>
                                        {paymentMethod ? (
                                            paymentMethod.paymentMethod === "Cash" ? "Tiền Mặt" : paymentMethod.paymentMethod === "VNPay" ? "Thanh toán qua VNPay" : "Thanh toán qua Momo"
                                        ) : (
                                            <span className="text-muted">Chưa có phương thức thanh toán</span>
                                        )}
                                    </td>
                                </tr>

                                <tr>
                                    <th>Trạng thái thanh toán</th>
                                    <td>
                                        {paymentMethod ? (
                                            paymentMethod.status === "Completed" ? (
                                                <span className="text-success">Đã hoàn thành</span>
                                            ) : paymentMethod.status === "Pending" ? (
                                                <span className="text-warning">Đang chờ</span>
                                            ) : (
                                                <span className="text-danger">Không thành công</span>
                                            )
                                        ) : (
                                            <span className="text-muted">Chưa có trạng thái thanh toán</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <div className="invoice-actions">
                            {invoiceStatus === "Paid" && (
                                <Button variant="primary" className="invoice-btn" onClick={() => window.print()}>
                                    <i className="fas fa-print me-2"></i>
                                    In hóa đơn
                                </Button>
                            )}

                            <>
                                {paymentMethod ? (
                                    paymentMethod.paymentMethod === "Cash" ? (
                                        <div className="alert alert-info">
                                            <i className="fas fa-info-circle me-2"></i>
                                            Vui lòng chờ nhân viên xác nhận thanh toán
                                        </div>
                                    ) : paymentMethod.status !== "Completed" ? (
                                        <Button
                                            variant="warning"
                                            className="invoice-btn"
                                            onClick={handlePaymentRedirect}
                                        >
                                            <i className="fas fa-redo me-2"></i>
                                            Thanh toán lại
                                        </Button>
                                    ) : null
                                ) : (
                                    <Button
                                        variant="success"
                                        className="invoice-btn"
                                        onClick={handlePaymentRedirect}
                                    >
                                        <i className="fas fa-credit-card me-2"></i>
                                        Chọn phương thức thanh toán
                                    </Button>
                                )}
                            </>

                        </div>
                    </Card.Body>
                </Card>
            </div>
        ) : (
            <div className="loading-container">
                <p>Không tìm thấy hóa đơn.</p>
            </div>
        )
    );
};

export default Invoice;