import { useContext, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Card, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { authApis, endpoint } from "../configs/Apis";
import toast from "react-hot-toast";
import MyToaster from "./layout/MyToaster";
import MyConfirm from "./layout/MyConfirm";

const Booking = () => {

    
    

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [showConfirm, setShowConfirm] = useState(false);
    const slot = location.state?.slot;
    const [appointment, setAppointment] = useState({});



    //của patient
    const user = useContext(MyUserContext);

    //duration là 120phuts 
    
    const Booking =  async () => {

        try {
            setLoading(true);
            let res = await authApis.post(endpoint['bookdoctor'], {

                patientId: user.userId,
                doctorId: slot.doctorId.doctorId,
                clinicId: slot.doctorId.clinics[0].clinicId,
                time : slot.slotDate + " " + slot.startTime,
                reason: appointment.reason,
                duration: 120,
                
            });

            toast.success("Đặt lịch thành công!");
           
        } catch (ex) {

            console.error(ex);
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
        <MyToaster />
        <Container fluid className="p-0">

            <Row className="justify-content-center custom-row-primary mt-4">

                

                <Col lg={8} md={10} sm={12}>
                <Container className="p-3 shadow rounded bg-light me-5"> 
                <h2 className="text-center">Thông tin chi tiết</h2>
                <Card>
                            
                            <Card.Body className="card-body-custom">
                                <Card.Text className="card-text">
                                    <strong >Thời gian</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong>Bác sĩ khám:</strong> {slot.doctorId.userDTO.firstName} {slot.doctorId.userDTO.lastName}
                                    <br />
                                    <strong>Nơi khám:</strong> {slot.doctorId.bio}
                                    <br />
                                   

                                </Card.Text>
                                <Card.Text className="card-text">
                                   
                                    
                                    <strong>Chi phí khám:</strong> {slot.doctorId.consultationFee.toLocaleString('vi-VN')} VNĐ
                                    <br />
                                    <strong>Bệnh viện:</strong> {slot.doctorId.clinics[0].name}
                                    <br />
                                    <strong>Địa chỉ:</strong> {slot.doctorId.clinics[0].address}
                                </Card.Text>
                                <FloatingLabel  label="Lý do khám" className="mb-3">
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