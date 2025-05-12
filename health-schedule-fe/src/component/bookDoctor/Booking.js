import { useContext, useState } from "react";
import { MyUserContext } from "../../configs/MyContexts";
import { Button, Card, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { authApis, authformdataApis, endpoint } from "../../configs/Apis";
import toast from "react-hot-toast";
import MyToaster from "../layout/MyToaster";
import MyConfirm from "../layout/MyConfirm";
import { ConvertToVietnamTime } from "../../utils/ConvertToVietnamTime";

const Booking = () => {




    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [showConfirm, setShowConfirm] = useState(false);
    const slot = location.state?.slot;
    const [appointment, setAppointment] = useState({});
    const nav = useNavigate();




    const formattedDate = slot.slotDate ? ConvertToVietnamTime(slot.slotDate) : "";
    const formattedTime = slot.startTime || "";
    const fullTime = `${formattedDate} ${formattedTime}`;



    //của patient
    const user = useContext(MyUserContext);

    const addInvoice = async () => {
        setLoading(true);
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
                console.log("Không thể tạo hóa đơn . Vui lòng thử lại.");
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi tạo hóa đơn:", error);
            console.log("Đã xảy ra lỗi. Vui lòng thử lại.");
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    const Booking = async () => {

        try {
            setLoading(true);
            let res = await authformdataApis().post(endpoint['bookdoctor'], {

                patientId: user.userId,
                doctorId: slot.doctorId.doctorId,
                clinicId: slot.doctorId.clinics[0].clinicId,
                time: fullTime,
                reason: appointment.reason,
                duration: 120,
                type: "Offline",

            });

            setAppointment(res); // không . data vì res là 1 object
            //Đặt lịch xong thì tạo hóa đơn
            await addInvoice();
            toast.success("Đặt lịch thành công!");
            nav("/appointment"); //Đặt xong về xem lịch hẹn
        } catch (ex) {
            // console.log(user.userId);
            // console.log(slot.doctorId.doctorId);
            // console.log(slot.doctorId.clinics[0].clinicId);
            // console.log(fullTime);
            // console.log(appointment.reason);

            // console.error(ex);
            toast.error("Đặt lịch thất bại!");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }

    }


    const handleConfirm = () => {
        setShowConfirm(true);
    };

    const handleClose = () => {
        setShowConfirm(false);
    };

   



    



    return (
        <>

            <Container fluid className="p-0">

                <Row className="justify-content-center custom-row-primary mt-4">



                    <Col lg={8} md={10} sm={12}>
                        <Container className="p-3 shadow rounded bg-light me-5">
                            <h2 className="text-center">Thông tin chi tiết</h2>
                            <Card>

                                <Card.Body className="card-body-custom">
                                    <Card.Text className="card-text">
                                        <strong >Thời gian khám:</strong> {slot.startTime} - {slot.endTime}
                                        <br />
                                        <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                        <br />
                                        <strong>Bác sĩ khám:</strong> {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                        <br />




                                    </Card.Text>

                                    {slot.doctorId.specialties.map(s => (
                                        <strong key={s.specialtyId}>Chuyên khoa: {s.name}</strong>
                                    ))}

                                    {slot.doctorId.clinics.map(c => (
                                        <Card.Text key={c.clinicId} className="card-text">
                                            <strong>Chi phí khám:</strong> {slot.doctorId.consultationFee.toLocaleString('vi-VN')} VNĐ
                                            <br />
                                            <strong>Bệnh viện:</strong> {c.name}
                                            <br />
                                            <strong>Địa chỉ:</strong> {c.address}
                                        </Card.Text>
                                    ))}

                                    <FloatingLabel label="Lý do khám" className="mb-3">
                                        <Form.Control type="text" placeholder="Lý do khám bệnh" required
                                            value={appointment.reason || ''} onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })} />
                                    </FloatingLabel>


                                    <Button variant="success" onClick={handleConfirm} disabled={loading}>
                                        Xác nhận đặt lịch
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Container>



                    </Col>



                </Row>
                <MyConfirm
                    show={showConfirm}
                    onHide={handleClose}

                    onConfirm={Booking}
                    loading={loading}
                    title="Xác nhận đặt lịch"
                    body="Bạn có chắc chắn muốn đặt lịch hẹn này không?"
                />


                <Row>


                </Row>
            </Container>
        </>
    );
}

export default Booking;







//     return (
//         <Container fluid className="p-0">
//             <Row className="justify-content-center custom-row-primary mt-4">
//                 <Col lg={8} md={10} sm={12}>
//                     <h2 className="text-center">Thông tin chi tiết</h2>
//                     {slot ? (
//                         <div>
//                             <p>Bác sĩ: {slot.doctorId.user.firstName} {slot.doctorId.user.lastName}</p>
//                             <p>Thời gian: {slot.startTime} - {slot.endTime}</p>
//                             <p>Ngày: {slot.slotDate}</p>
//                             <p>Chuyên môn: {slot.doctorId.bio}</p>
//                         </div>
//                     ) : (
//                         <p>Không có thông tin slot</p>
//                     )}
//                 </Col>
//             </Row>
//         </Container>
//     );
// };