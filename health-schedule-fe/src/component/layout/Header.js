import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Styles/Header.css";
import { useContext, useEffect, useState } from "react";
import { MyDipatcherContext, MyUserContext } from "../../configs/MyContexts";
import { generateToken, messaging } from "../../notifications/firebase";
import { onMessage } from "firebase/messaging";
const Header = () => {


    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDipatcherContext);

    //Lấy tb ra
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });
    //đếm tb đọc hay chưa
    const [unreadCount, setUnreadCount] = useState(() => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.filter(n => !n.read).length;
        }
        return 0;
    });
    const [showDropdown, setShowDropdown] = useState(false);




    //Token notifications
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log(' FCM Message:', payload);

            const newNotification = {
                id: payload.messageId,
                title: payload.notification?.title || 'Không có tiêu đề',
                body: payload.notification?.body || 'Không có nội dung',
                timestamp: new Date().toISOString(),
                read: false //tin nhắn mới đều chưa đọc
            };

            const updatedNotifications = [newNotification, ...notifications];
            setNotifications(updatedNotifications);
            //Thông báo mới lưu vào localStorage
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
            //update dô tb chưa đọc
            setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [notifications]);


    //Hmà đặt tất cả
    const handleReadAll = () => {
        const updated = notifications.map(n => ({ ...n, read: true })); //set read về true hết
        setNotifications(updated);
        setUnreadCount(0);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };



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
                        {user === null || user.role === "Patient" ? <>
                            <Link to="/calendar" className="nav-link text-dark nav-item-with-subtext ms-4 ">Xem lịch trống
                                <span>Đặt khám ngay</span></Link>
                        </> : <></>}



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


                        {user === null || user.role === "Patient" ? <>
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
                        </> : <></>}

                    </Nav>
                    { }
                    {/* Thông báo ưu đãi */}
                    {user !== null ? <>
                        <Nav.Item className="position-relative me-3">
                            <Button variant="link" className="p-0" onClick={() => setShowDropdown(!showDropdown)}>
                                <i className="bi bi-bell" style={{ fontSize: 24 }}></i>
                                {unreadCount > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            background: "red",
                                            color: "white",
                                            borderRadius: "50%",
                                            fontSize: 12,
                                            width: 18,
                                            height: 18,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>

                            {showDropdown && (
                                <div className="notification-dropdown shadow rounded bg-white position-absolute" style={{ right: 0, zIndex: 1000, width: 300 }}>
                                    <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                        <strong>Thông báo</strong>
                                        <Button variant="link" size="sm" onClick={handleReadAll}>Đánh dấu đã đọc</Button>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div className="text-center p-2">Không có thông báo</div>
                                    ) : (
                                        notifications.slice(0, 5).map((n, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    background: n.read ? "#f8f9fa" : "#e9ecef",
                                                    padding: "8px 12px",
                                                    borderBottom: "1px solid #dee2e6"
                                                }}
                                            >
                                                <strong>{n.title}</strong>
                                                <div>{n.body}</div>
                                                <small className="text-muted">{new Date(n.timestamp).toLocaleString()}</small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </Nav.Item>

                    </> : <>
                    </>}

                    <Nav className="header-auth ">

                        {user === null ? <>
                            <Button variant="outline-success" as={Link} to="/register" className="me-2 sign-in-btn">
                                Đăng ký
                            </Button>
                            <Button variant="primary" as={Link} to="/login" className="log-in-btn">
                                Đăng nhập
                            </Button>
                        </> : <>
                            <div className="nav-link text-danger">
                                <NavDropdown
                                    title={
                                        <span>
                                            <img src={user.avatar} width="40" className="rounded-circle" alt="Avatar" />
                                            Chào {user.username}!
                                        </span>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/editProfile">
                                        Sửa thông tin cá nhân
                                    </NavDropdown.Item>

                                    {user.role === "Doctor" ? <> <NavDropdown.Item as={Link} to="/doctorAvailability">
                                        Lịch làm việc của bạn
                                    </NavDropdown.Item>
                                    </> : <></>}

                                    <NavDropdown.Item as={Link} to="/change-password">
                                        Đổi mật khẩu
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => dispatch({ type: "logout" })} as={Link} to="/login">
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                            <Button
                                variant="danger"
                                className="logout-btn d-flex align-items-center"
                                onClick={() => dispatch({ type: "logout" })}
                                as={Link}
                                to="/login"
                            >
                                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                            </Button>
                        </>}
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header