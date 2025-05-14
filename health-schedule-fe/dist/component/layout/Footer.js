"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
const free_brands_svg_icons_1 = require("@fortawesome/free-brands-svg-icons");
require("./Styles/Footer.css");
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (<footer className="site-footer mt-5">
            <react_bootstrap_1.Container className="p-0">
                <react_bootstrap_1.Row>
                    {/* Cột 1: Thông tin công ty */}
                    <react_bootstrap_1.Col xs={12} md={6} lg={3} className="footer-col d-flex flex-column">
                        <h5 className="fw-bold mb-3">PHÒNG KHÁM SỨC KHỎE HEALTHCARE VIỆT NAM</h5>
                        <p className="mb-2">VPĐD: 1664 Lê Văn Lương, X.Nhơn Đức, H. Nhà Bè, TP. HCM</p>
                        <p className="mb-2">Số ĐKKD 0933033801 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp lần đầu ngày 20/04/2025</p>
                        <p className="mb-0">Chủ trách nhiệm nội dung: Trần Thế Anh</p>
                    </react_bootstrap_1.Col>

                    {/* Cột 2: Về Chúng tôi */}
                    <react_bootstrap_1.Col xs={12} md={6} lg={2} className="footer-col d-flex flex-column">
                        <h5>VỀ HEALTHCARE</h5>

                        {/* Nav.Link mà có as= {Link thì như thể Link} dùng Nav.Link của bootstrap để css sẳn  nhiều  */}
                        <react_bootstrap_1.Nav className="flex-column footer-nav">
                            <react_router_dom_1.Link className="nav-link text-dark" to="/gioi-thieu">Giới thiệu về HEALTHCARE</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/ban-dieu-hanh">Ban điều hành</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/tuyen-dung">Nhân sự & Tuyển dụng</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/lien-he">Liên hệ</react_router_dom_1.Link>
                        </react_bootstrap_1.Nav>
                    </react_bootstrap_1.Col>
                    {/* Cột 3: Dịch vụ */}
                    <react_bootstrap_1.Col xs={12} md={6} lg={2} className="footer-col d-flex flex-column">
                        {/* ms qua phải */}
                        <h5 className="ms-4">Dịch vụ</h5>
                        <react_bootstrap_1.Nav className="flex-column footer-nav">
                            <react_router_dom_1.Link className="nav-link text-dark" to="/dat-kham-bac-si">Đặt khám Bác sĩ</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/dat-kham-benh-vien">Đặt khám Bệnh viện</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/dat-kham-phong-kham">Đặt khám Phòng khám</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/store">HEALTHCARE</react_router_dom_1.Link>
                        </react_bootstrap_1.Nav>
                    </react_bootstrap_1.Col>
                    {/* Cột 4: Hỗ trợ */}
                    <react_bootstrap_1.Col xs={12} md={6} lg={2} className="footer-col">
                        <h5 className="ms-3">Hỗ trợ</h5>
                        <react_bootstrap_1.Nav className="flex-column footer-nav">
                            <react_router_dom_1.Link className="nav-link text-dark" to="/cau-hoi-thuong-gap">Câu hỏi thường gặp</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/dieu-khoan-su-dung">Điều khoản sử dụng</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/chinh-sach-bao-mat">Chính sách bảo mật</react_router_dom_1.Link>
                            <react_router_dom_1.Link className="nav-link text-dark" to="/chinh-sach-giai-quyet-khieu-nai">Chính sách giải quyết khiếu nại</react_router_dom_1.Link>
                            <p className="ms-3">Hỗ trợ khách hàng: <react_router_dom_1.Link to="mailto:cskh@improok.vn">cskh@healthcare.vn</react_router_dom_1.Link></p>
                        </react_bootstrap_1.Nav>
                    </react_bootstrap_1.Col>
                    {/* Cột 5: Kết nối & Chứng nhận */}
                    <react_bootstrap_1.Col xs={12} lg={3} className="footer-col">
                        <h5>Kết nối với chúng tôi</h5>
                        <div className="social-icons ">
                            <react_router_dom_1.Link className="ms-2" to="https://facebook.com" target="_blank"><react_fontawesome_1.FontAwesomeIcon icon={free_brands_svg_icons_1.faFacebook}/></react_router_dom_1.Link>
                            <react_router_dom_1.Link className="ms-2" to="https://youtube.com" target="_blank"><react_fontawesome_1.FontAwesomeIcon icon={free_brands_svg_icons_1.faYoutube}/></react_router_dom_1.Link>
                            <react_router_dom_1.Link className="ms-2" to="https://linkedin.com" target="_blank"><react_fontawesome_1.FontAwesomeIcon icon={free_brands_svg_icons_1.faLinkedin}/></react_router_dom_1.Link>
                            <react_router_dom_1.Link className="ms-2" to="https://google.com" target="_blank"><react_fontawesome_1.FontAwesomeIcon icon={free_brands_svg_icons_1.faGoogle}/></react_router_dom_1.Link>
                        </div>
                        <div className="cert-logos">
                            <react_bootstrap_1.Image src="/assets/images/dangky.png" alt="Đã đăng ký Bộ Công Thương" height={40} className="me-2"/>
                            <react_bootstrap_1.Image src="/assets/images/logoDCMA.png" alt="DMCA Protected" height={40}/>
                        </div>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
                <hr />
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col className="text-center footer-bottom">
                        <p className="small">Các thông tin trên HealthCare chỉ dành cho mục đích tham khảo, tra cứu và không thay thế cho việc chuẩn đoán hoặc điều trị y khoa.</p>
                        <p className="small">Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.</p>
                        <p className="small">Copyright © 2024 - {currentYear} Phòng Khám HealthCare Việt Nam.</p>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
            </react_bootstrap_1.Container>

        </footer>);
};
exports.default = Footer;
