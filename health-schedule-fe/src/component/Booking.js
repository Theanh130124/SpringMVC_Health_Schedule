import { useContext, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";
import { Col, Container, Row } from "react-bootstrap";

const Booking = () => {

    
    
    const [slots, setSlots] = useState([]); // lấy doctorId và clinicId , time
    const [loading, setLoading] = useState(false);




    //của patient
    const user = useContext(MyUserContext);

    //duration là 120phuts 
    
    
        
        
        
    

    return (

        <Container fluid className="p-0">

            <Row className="justify-content-center custom-row-primary mt-4">

                

                <Col lg={8} md={10} sm={12}>
                <h2 className="text-center">Thông tin chi tiết</h2>
                </Col>

            </Row>

            <Row>


            </Row>
        </Container>

    );
}

export default Booking;