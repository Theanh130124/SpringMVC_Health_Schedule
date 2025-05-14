import { Carousel, Col, Container, Form, Image, Row } from "react-bootstrap"
import "./Styles/Home.css"
import { useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import RotatingText from "./reactbits/RotatingText";
import ChatBot from "./ChatBot";


const Home = () => {
    const slideItems = [
        { id: 1, title: "Đặt lịch khám", desc: "Nhanh chóng, dễ dàng mọi lúc mọi nơi" },
        { id: 2, title: "Bác sĩ tư vấn", desc: "Tư vấn trực tuyến với bác sĩ giàu kinh nghiệm" },
        { id: 3, title: "Đặt lịch xét nghiệm", desc: "Lên lịch xét nghiệm tận nơi linh hoạt" },
        { id: 4, title: "Thanh toán viện phí", desc: "Thanh toán không tiền mặt tiện lợi" },
        { id: 5, title: "Quản lý hồ sơ y tế", desc: "Lưu trữ và xem lại lịch sử khám chữa bệnh" },
        { id: 6, title: "Theo dõi đơn thuốc", desc: "Xem và nhắc nhở uống thuốc đúng giờ" },
        { id: 7, title: "Hỗ trợ y tế 24/7", desc: "Luôn có nhân viên hỗ trợ bất kể thời gian" },
        { id: 8, title: "Tái khám dễ dàng", desc: "Đặt lịch tái khám chỉ trong vài bước" },
    ];

    const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || "");

    useEffect(() => {
        if (message) {

            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
        <>
            <Container fluid className="p-0">
                {message && (
                    <Alert variant="success" className="text-center">
                        {message}
                    </Alert>
                )}
                <Row className="align-items-center justify-content-center custom-row mt-5">
                    <Col xs={12} md={7} lg={6} className="home-text">
                        <h2 className="text-white">Đặt khám bác sĩ</h2>
                        <span>
                            Đặt khám với hơn 500 bác sĩ đã kết nối chính thức với HEALTH CARE để có số thứ tự và khung giờ khám trước
                        </span>
                        <RotatingText
                            texts={[
                                "Đặt lịch khám dễ dàng",
                                "Tư vấn sức khỏe trực tuyến",
                                "Bác sĩ uy tín, tận tâm",
                                "Hỗ trợ 24/7 cho bạn"
                            ]}
                            mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                            staggerFrom={"last"}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                    </Col>


                    <Col xs={12} md={5} lg={4} className="text-center mt-4 mt-md-0">
                        <Image src="/assets/images/doctor.jpg" alt="Doctor" className="doctor-image" />
                    </Col>

                </Row>

                <Row className="align-items-center justify-content-center mt-5">
                    <Col xs={12} md={8} lg={6} className="text-center mt-4 home-text">
                        <h2>Dịch vụ</h2>


                        <hr className="my-4 border border-dark" />
                    </Col>
                </Row>
                <Row className="align-items-center justify-content-center mt-2">

                    <Carousel className="custom-carousel">
                        {/* Slide đầu */}
                        <Carousel.Item>
                            <Row className="justify-content-center ">
                                {slideItems.slice(0, 4).map((item) => (
                                    <Col key={item.id} xs={12} sm={6} md={3} className="mb-4">
                                        <div className="card-wrapper">
                                            <Image
                                                src="/assets/images/service.png"
                                                alt={item.title}
                                                className="carousel-image"
                                                fluid
                                            />
                                            <Carousel.Caption>
                                                <h5>{item.title}</h5>
                                                <p>{item.desc}</p>
                                            </Carousel.Caption>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>

                        {/* Slide tiếp theo */}
                        <Carousel.Item>
                            <Row className="justify-content-center">
                                {slideItems.slice(4, 8).map((item) => (
                                    <Col key={item.id} xs={12} sm={6} md={3} className="mb-4">
                                        <div className="card-wrapper">
                                            <Image
                                                src="/assets/images/service.png"
                                                alt={item.title}
                                                className="carousel-image"
                                                fluid
                                            />
                                            <Carousel.Caption>
                                                <h5>{item.title}</h5>
                                                <p>{item.desc}</p>
                                            </Carousel.Caption>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Carousel.Item>
                    </Carousel>

                </Row>
            </Container>
            <ChatBot />
        </>
    );

};


export default Home