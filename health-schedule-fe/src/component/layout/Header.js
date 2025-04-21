import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

import "./Styles/Header.css";

const Header = () => {
    return (
        <Navbar collapseOnSelect expand="lg" variant="light" bg="light" className="custom-header">
            <Container className="p-0">
                <Navbar.Brand as={Link} to="/" className="header-logo-link ">

                    <h2 className="logo-title">
                        <span className="logo-health">HEALTH</span>
                        <span className="logo-care">CARE.</span>
                    </h2>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto  header-menu text-center">
                        <Link to="/booking" className="nav-link text-dark nav-item-with-subtext ms-4 ">Đặt khám
                            <span>Đặt khám ngay</span></Link>


                        <Link to="/review" className="nav-item-with-subtext nav-link ms-4 text-center">
                            Xem đánh giá
                            <span>Đánh giá về những bác sĩ</span>
                        </Link>
                        <NavDropdown
                            title={
                                <div className="nav-item-with-subtext">
                                    Tìm bác sĩ
                                    <span>Tìm ngay...</span>
                                </div>
                            }
                            id="collapsible-nav-dropdown"
                            className="nav-item-dropdown ms-4"
                        >
                            {/* Tìm bác sĩ ở đây */}
                            <NavDropdown.Item as={Link} to="/findDoctor">Tìm ngay...</NavDropdown.Item>
                        </NavDropdown>


                    </Nav>
                    <Nav className="header-auth ">

                        <Button variant="outline-success" as={Link} to="/register" className="me-2 sign-in-btn">
                            Đăng ký
                        </Button>
                        <Button variant="primary" as={Link} to="/login" className="log-in-btn">
                            Đăng nhập
                        </Button>

                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header