import React, { useState, useEffect } from "react";
import { Card, Table, Button, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { authApis } from "../configs/Apis";

const Invoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const appointment = location.state?.appointment;
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoiceStatus,setInvoiceStatus] = useState(null);


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
            setInvoiceStatus(response.data.status);
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn:", error);
            setError("Không thể tải hóa đơn. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

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
            <div className="text-center">
                <Spinner animation="border" />
                <p>Đang tải hóa đơn...</p>
            </div>
        ) : error ? (
            <div className="text-center">
                <p>{error}</p>
            </div>
        ) : invoice ? (
            <div className="container mt-5">
                <h2 className="text-center mb-4">Chi Tiết Hóa Đơn</h2>
                <Card className="shadow-sm">
                    <Card.Body>
                        <h4 className="mb-3">Thông Tin Hóa Đơn</h4>
                        <Table bordered>
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
                        </Table>
                        {invoiceStatus && invoiceStatus === "Paid" ? (                        
                        <div className="text-center mt-4">
                            <Button variant="primary" onClick={() => window.print()}>
                                In hóa đơn
                            </Button>
                        </div>
                        ) :(
                        <div className="text-center mt-4">
                            <Button variant="secondary" onClick={handlePaymentRedirect}>
                                Thanh toán
                            </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        ) : (
            <div className="text-center">
                <p>Không tìm thấy hóa đơn.</p>
            </div>
        )
    );
};

export default Invoice;