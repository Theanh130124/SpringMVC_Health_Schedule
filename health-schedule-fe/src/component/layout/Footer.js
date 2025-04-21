import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Col, Container, Image, Nav, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import { faFacebook, faYoutube, faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';


import "./Styles/Footer.css";


const Footer = () => {
    const currentYear = new Date().getFullYear();


    return (
        <footer className="site-footer mt-5">
            <Container  className="p-0">
                <Row>
                    {/* Cột 1: Thông tin công ty */}
                    <Col xs={12} md={6} lg={3} className="footer-col d-flex flex-column">
                        <h5 className="fw-bold mb-3">PHÒNG KHÁM SỨC KHỎE HEALTHCARE VIỆT NAM</h5>
                        <p className="mb-2">VPĐD: 1664 Lê Văn Lương, X.Nhơn Đức, H. Nhà Bè, TP. HCM</p>
                        <p className="mb-2">Số ĐKKD 0933033801 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp lần đầu ngày 20/04/2025</p>
                        <p className="mb-0">Chủ trách nhiệm nội dung: Trần Thế Anh</p>
                    </Col>

                    {/* Cột 2: Về Chúng tôi */}
                    <Col xs={12} md={6} lg={2} className="footer-col d-flex flex-column">
                        <h5 >VỀ HEALTHCARE</h5>

                        {/* Nav.Link mà có as= {Link thì như thể Link} dùng Nav.Link của bootstrap để css sẳn  nhiều  */}
                        <Nav className="flex-column footer-nav">
                            <Link className="nav-link text-dark" to="/gioi-thieu"  >Giới thiệu về HEALTHCARE</Link>
                            <Link className="nav-link text-dark" to="/ban-dieu-hanh">Ban điều hành</Link>
                            <Link className="nav-link text-dark" to="/tuyen-dung">Nhân sự & Tuyển dụng</Link>
                            <Link className="nav-link text-dark" to="/lien-he">Liên hệ</Link>
                        </Nav>
                    </Col>
                    {/* Cột 3: Dịch vụ */}
                    <Col xs={12} md={6} lg={2} className="footer-col d-flex flex-column">
                        {/* ms qua phải */}
                        <h5 className="ms-4">Dịch vụ</h5>
                        <Nav className="flex-column footer-nav">
                            <Link className="nav-link text-dark" to="/dat-kham-bac-si">Đặt khám Bác sĩ</Link>
                            <Link className="nav-link text-dark" to="/dat-kham-benh-vien">Đặt khám Bệnh viện</Link>
                            <Link className="nav-link text-dark" to="/dat-kham-phong-kham">Đặt khám Phòng khám</Link>
                            <Link className="nav-link text-dark" to="/store">HEALTHCARE</Link>
                        </Nav>
                    </Col>
                    {/* Cột 4: Hỗ trợ */}
                    <Col xs={12} md={6} lg={2} className="footer-col">
                        <h5 className="ms-3">Hỗ trợ</h5>
                        <Nav className="flex-column footer-nav">
                            <Link className="nav-link text-dark" to="/cau-hoi-thuong-gap">Câu hỏi thường gặp</Link>
                            <Link className="nav-link text-dark" to="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
                            <Link className="nav-link text-dark" to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
                            <Link className="nav-link text-dark" to="/chinh-sach-giai-quyet-khieu-nai">Chính sách giải quyết khiếu nại</Link>
                            <p className="ms-3" >Hỗ trợ khách hàng: <Link to="mailto:cskh@improok.vn">cskh@healthcare.vn</Link></p>
                        </Nav>
                    </Col>
                    {/* Cột 5: Kết nối & Chứng nhận */}
                    <Col xs={12} lg={3} className="footer-col">
                        <h5>Kết nối với chúng tôi</h5>
                        <div className="social-icons ">
                            <Link className="ms-2" to="https://facebook.com" target="_blank"  ><FontAwesomeIcon icon={faFacebook} /></Link>
                            <Link className="ms-2" to="https://youtube.com" target="_blank"><FontAwesomeIcon icon={faYoutube} /></Link>
                            <Link className="ms-2" to="https://linkedin.com" target="_blank"><FontAwesomeIcon icon={faLinkedin} /></Link>
                            <Link className="ms-2" to="https://google.com" target="_blank" ><FontAwesomeIcon icon={faGoogle} /></Link>
                        </div>
                        <div className="cert-logos">
                            <Image src="/assets/images/dangky.png" alt="Đã đăng ký Bộ Công Thương" height={40} className="me-2" />
                            <Image src="/assets/images/logoDCMA.png" alt="DMCA Protected" height={40} />
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className="text-center footer-bottom">
                        <p className="small">Các thông tin trên HealthCare chỉ dành cho mục đích tham khảo, tra cứu và không thay thế cho việc chuẩn đoán hoặc điều trị y khoa.</p>
                        <p className="small">Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.</p>
                        <p className="small">Copyright © 2024 - {currentYear} Phòng Khám HealthCare Việt Nam.</p>
                    </Col>
                </Row>
            </Container>

        </footer>
    )
}

export default Footer