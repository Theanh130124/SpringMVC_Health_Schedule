import { useContext, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import { Button, Card, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Booking = () => {

    
    

    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const slot = location.state?.slot;
    const [appointment, setAppointment] = useState();



    //của patient
    const user = useContext(MyUserContext);

    //duration là 120phuts 
    
    // const Booking =  async () => {

    //     try {
    //         setLoading(true);
            
           



    //         console.log(res.data);
    //     } catch (ex) {
    //         console.error(ex);
    //     } finally {
    //         setLoading(false);
    //     }


    // }


    // const handleBooking = async () => {


    // }


        
        
        
    

    return (

        <Container fluid className="p-0">

            <Row className="justify-content-center custom-row-primary mt-4">

                

                <Col lg={6} md={8} sm={10}>
                <Container className="p-3 shadow rounded bg-light me-5"> 
                <h2 className="text-center">Thông tin chi tiết</h2>
                <Card>
                            
                            <Card.Body className="card-body-custom">
                                <Card.Text className="card-text">
                                    <strong >Thời gian</strong> {slot.startTime} - {slot.endTime}
                                    <br />
                                    <strong>Ngày khám:</strong> {new Date(slot.slotDate).toLocaleDateString()}
                                    <br />
                                    <strong>Bác sĩ khám:</strong> {slot.doctorId.user.firstName} {slot.doctorId.user.lastName}
                                    <br />
                                    <strong>Nơi khám:</strong> {slot.doctorId.bio}

                                </Card.Text>


                                <Button variant="success" onClick ="">
                                    Xác nhận đặt lịch 
                                </Button>
                            </Card.Body>
                        </Card>
                </Container>



                </Col>

                <Col lg={6} md={4} sm={2}>
                {/* <Container className="p-3 shadow rounded bg-light me-5"> 


                <FloatingLabel  label="Lý do khám" className="mb-3">
                    <Form.Control type="text" placeholder="Lý do khám" required
                        value={appointment.reason} onChange={e => setAppointment(e.target.value)} />
                                                    </FloatingLabel>
                    </Container> */}

                </Col>

            </Row>

            <Row>


            </Row>
        </Container>

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