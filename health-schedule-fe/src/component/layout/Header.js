import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

import "./Styles/Header.css";
import { useContext } from "react";
import { MyDipatcherContext, MyUserContext } from "../../configs/MyContexts";

const Header = () => {


    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDipatcherContext);





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
                        <Link to="/calendar" className="nav-link text-dark nav-item-with-subtext ms-4 ">Xem lịch trống
                            <span>Đặt khám ngay</span></Link>


                        <Link to="/review" className="nav-item-with-subtext nav-link ms-4 text-center">
                            Xem đánh giá
                            <span>Đánh giá về những bác sĩ</span>
                        </Link>

                        {user !== null ? <>
                            <Link to="/appointment" className="nav-item-with-subtext nav-link ms-4 text-center">

                                Lịch hẹn của bạn
                                <span>Xem lại</span>

                            </Link>
                        </> :
                            <></>
                        }


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

                        {user === null ? <>
                            <Button variant="outline-success" as={Link} to="/register" className="me-2 sign-in-btn">
                                Đăng ký
                            </Button>
                            <Button variant="primary" as={Link} to="/login" className="log-in-btn">
                                Đăng nhập
                            </Button>
                        </> : <>
                            <Link to="/" className="nav-link text-danger">
                                <img src={user.avatar} width="40" className="rounded-circle" />
                                Chào {user.username}!
                            </Link>
                            <Button variant="danger" onClick={() => dispatch({ "type": "logout" })} as={Link} to="/login" >
                                Đăng xuất
                            </Button>
                        </>}
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header