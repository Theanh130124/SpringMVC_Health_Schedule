import { useEffect, useState } from "react";
import Apis, { authApis, authformdataApis, endpoint } from "../../configs/Apis";
import { useLocation, useNavigate } from "react-router-dom";
import { ConvertToVietnamTime } from "../../utils/ConvertToVietnamTime";
import toast from "react-hot-toast";
import MySpinner from "../layout/MySpinner";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";





//Hủy hoặc sửa lịch trong 24h
const AppointmentUpdate = () => {

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const appointments = location.state?.appointment;
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState(appointments?.reason || "");
    const nav = useNavigate();




    //Tải lên danh sách lịch hẹn trống 

    const fetchSlots = async () => {
        try {

            setLoading(true);
            let res = await Apis.get(endpoint.findDoctorById(appointments.doctorId.doctorId));
            setSlots(res.data);
        } catch (ex) {

            console.log("Lỗi khi lấy danh sách slots:", ex);
        }
        finally {
            setLoading(false);
        }
    }



    const handleUpdateAppointment = async (appointmentId) => {
        try {

            setLoading(true);
            const payload = {
                doctorId: appointments.doctorId.doctorId,
                reason: reason,
            };

            // Nếu người dùng chọn thời gian mới, thêm `time` vào payload
            if (selectedSlot) {
                const formattedDate = ConvertToVietnamTime(selectedSlot.slotDate);
                const fullTime = `${formattedDate} ${selectedSlot.startTime}`;
                payload.time = fullTime;
            }

            
            await authApis().patch(endpoint["updateBookDoctor"](appointmentId), payload);
            nav("/appointment")
            toast.success("Cập nhật lịch hẹn thành công!");


        } catch (ex) {
            toast.error("Cập nhật lịch hẹn thất bại!");
            // console.error("Lỗi khi lấy danh sách slots:", ex);
            // const formattedDate = ConvertToVietnamTime(selectedSlot.slotDate);
            // console.log(`${formattedDate} ${selectedSlot.startTime}`);
            // console.log(appointments.appointmentId);
            // console.log(appointments.doctorId.doctorId);
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchSlots();

    }, [appointments])

    return (
        <>
            <Container fluid className="p-0">

                <Row className="justify-content-center custom-row-primary mt-4">
                    <Col lg={8} md={10} sm={12}>
                        <h2 className="text-center">Sửa lịch hẹn</h2>
                        {loading && <MySpinner />}
                        {!loading && (
                            <Card>
                                <Card.Body className="card-body-custom">
                                    <Form.Group>
                                        <Form.Label>Chọn thời gian mới:</Form.Label>
                                        <Form.Select
                                            value={selectedSlot?.slotId || ""}
                                            onChange={(e) =>
                                                setSelectedSlot(slots.find((slot) => slot.slotId === parseInt(e.target.value)))
                                            }
                                        >
                                            <option value="">-- Chọn thời gian  --</option>
                                            {slots.map((slot) => (
                                                <option key={slot.slotId} value={slot.slotId}>
                                                     {` Ngày : ${ConvertToVietnamTime(slot.slotDate)} - Thời gian bắt đầu : ${slot.startTime}`}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Form.Label>Lý do khám:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Nhập lý do khám"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        className="mt-3"
                                        onClick={() => handleUpdateAppointment(appointments.appointmentId)}
                                        disabled={loading}
                                    >
                                        Cập nhật lịch hẹn
                                    </Button>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )


}


export default AppointmentUpdate;