"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_bootstrap_1 = require("react-bootstrap");
const react_router_dom_1 = require("react-router-dom");
require("bootstrap-icons/font/bootstrap-icons.css");
require("./Styles/Header.css");
const react_1 = require("react");
const MyContexts_1 = require("../../configs/MyContexts");
const firebase_1 = require("../../notifications/firebase");
const messaging_1 = require("firebase/messaging");
const Header = () => {
    const user = (0, react_1.useContext)(MyContexts_1.MyUserContext);
    const dispatch = (0, react_1.useContext)(MyContexts_1.MyDipatcherContext);
    //Lấy tb ra
    const [notifications, setNotifications] = (0, react_1.useState)(() => {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
    });
    //đếm tb đọc hay chưa
    const [unreadCount, setUnreadCount] = (0, react_1.useState)(() => {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.filter(n => !n.read).length;
        }
        return 0;
    });
    const [showDropdown, setShowDropdown] = (0, react_1.useState)(false);
    //Token notifications
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, messaging_1.onMessage)(firebase_1.messaging, (payload) => {
            var _a, _b;
            console.log(' FCM Message:', payload);
            const newNotification = {
                id: payload.messageId,
                title: ((_a = payload.notification) === null || _a === void 0 ? void 0 : _a.title) || 'Không có tiêu đề',
                body: ((_b = payload.notification) === null || _b === void 0 ? void 0 : _b.body) || 'Không có nội dung',
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
        const updated = notifications.map(n => (Object.assign(Object.assign({}, n), { read: true }))); //set read về true hết
        setNotifications(updated);
        setUnreadCount(0);
        localStorage.setItem("notifications", JSON.stringify(updated));
    };
    return (<react_bootstrap_1.Navbar collapseOnSelect expand="lg" variant="light" bg="light" className="custom-header">
            <react_bootstrap_1.Container className="p-0">
                <react_bootstrap_1.Navbar.Brand as={react_router_dom_1.Link} to="/" className="header-logo-link ">

                    <h2 className="logo-title">
                        <span className="logo-health">HEALTH</span>
                        <span className="logo-care">CARE.</span>
                    </h2>
                </react_bootstrap_1.Navbar.Brand>
                <react_bootstrap_1.Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <react_bootstrap_1.Navbar.Collapse id="responsive-navbar-nav">
                    <react_bootstrap_1.Nav className="me-auto  header-menu text-center">
                        {user === null || user.role === "Patient" ? <>
                            <react_router_dom_1.Link to="/calendar" className="nav-link text-dark nav-item-with-subtext ms-4 ">Xem lịch trống
                                <span>Đặt khám ngay</span></react_router_dom_1.Link>
                        </> : <></>}



                        <react_router_dom_1.Link to="/review" className="nav-item-with-subtext nav-link ms-4 text-center">
                            Xem đánh giá
                            <span>Đánh giá về những bác sĩ</span>
                        </react_router_dom_1.Link>

                        {user !== null ? <>
                            <react_router_dom_1.Link to="/appointment" className="nav-item-with-subtext nav-link ms-4 text-center">

                                Lịch hẹn của bạn
                                <span>Xem lại</span>

                            </react_router_dom_1.Link>
                        </> :
            <></>}


                        {user === null || user.role === "Patient" ? <>
                            <react_bootstrap_1.NavDropdown title={<div className="nav-item-with-subtext">
                                        Tìm bác sĩ
                                        <span>Tìm ngay...</span>
                                    </div>} id="collapsible-nav-dropdown" className="nav-item-dropdown ms-4">
                                {/* Tìm bác sĩ ở đây */}
                                <react_bootstrap_1.NavDropdown.Item as={react_router_dom_1.Link} to="/findDoctor">Tìm ngay...</react_bootstrap_1.NavDropdown.Item>
                            </react_bootstrap_1.NavDropdown>
                        </> : <></>}

                    </react_bootstrap_1.Nav>
                    
                    {/* Thông báo ưu đãi */}
                    {user !== null ? <>
                        <react_bootstrap_1.Nav.Item className="position-relative me-3">
                            <react_bootstrap_1.Button variant="link" className="p-0" onClick={() => setShowDropdown(!showDropdown)}>
                                <i className="bi bi-bell" style={{ fontSize: 24 }}></i>
                                {unreadCount > 0 && (<span style={{
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
                }}>
                                        {unreadCount}
                                    </span>)}
                            </react_bootstrap_1.Button>

                            {showDropdown && (<div className="notification-dropdown shadow rounded bg-white position-absolute" style={{ right: 0, zIndex: 1000, width: 300 }}>
                                    <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                        <strong>Thông báo</strong>
                                        <react_bootstrap_1.Button variant="link" size="sm" onClick={handleReadAll}>Đánh dấu đã đọc</react_bootstrap_1.Button>
                                    </div>
                                    {notifications.length === 0 ? (<div className="text-center p-2">Không có thông báo</div>) : (notifications.slice(0, 5).map((n, idx) => (<div key={idx} style={{
                        background: n.read ? "#f8f9fa" : "#e9ecef",
                        padding: "8px 12px",
                        borderBottom: "1px solid #dee2e6"
                    }}>
                                                <strong>{n.title}</strong>
                                                <div>{n.body}</div>
                                                <small className="text-muted">{new Date(n.timestamp).toLocaleString()}</small>
                                            </div>)))}
                                </div>)}
                        </react_bootstrap_1.Nav.Item>

                    </> : <>
                    </>}

                    <react_bootstrap_1.Nav className="header-auth ">

                        {user === null ? <>
                            <react_bootstrap_1.Button variant="outline-success" as={react_router_dom_1.Link} to="/register" className="me-2 sign-in-btn">
                                Đăng ký
                            </react_bootstrap_1.Button>
                            <react_bootstrap_1.Button variant="primary" as={react_router_dom_1.Link} to="/login" className="log-in-btn">
                                Đăng nhập
                            </react_bootstrap_1.Button>
                        </> : <>
                            <div className="nav-link text-danger">
                                <react_bootstrap_1.NavDropdown title={<span>
                                            <img src={user.avatar} width="40" className="rounded-circle" alt="Avatar"/>
                                            Chào {user.username}!
                                        </span>} id="user-dropdown" align="end">
                                    <react_bootstrap_1.NavDropdown.Item as={react_router_dom_1.Link} to="/editProfile">
                                        Sửa thông tin cá nhân
                                    </react_bootstrap_1.NavDropdown.Item>

                                    {user.role === "Doctor" ? <> <react_bootstrap_1.NavDropdown.Item as={react_router_dom_1.Link} to="/doctorAvailability">
                                        Lịch làm việc của bạn
                                    </react_bootstrap_1.NavDropdown.Item>
                                    </> : <></>}

                                    <react_bootstrap_1.NavDropdown.Item as={react_router_dom_1.Link} to="/change-password">
                                        Đổi mật khẩu
                                    </react_bootstrap_1.NavDropdown.Item>
                                    <react_bootstrap_1.NavDropdown.Divider />
                                    <react_bootstrap_1.NavDropdown.Item onClick={() => dispatch({ type: "logout" })} as={react_router_dom_1.Link} to="/login">
                                        Đăng xuất
                                    </react_bootstrap_1.NavDropdown.Item>
                                </react_bootstrap_1.NavDropdown>
                            </div>
                            <react_bootstrap_1.Button variant="danger" className="logout-btn d-flex align-items-center" onClick={() => dispatch({ type: "logout" })} as={react_router_dom_1.Link} to="/login">
                                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                            </react_bootstrap_1.Button>
                        </>}
                    </react_bootstrap_1.Nav>

                </react_bootstrap_1.Navbar.Collapse>
            </react_bootstrap_1.Container>
        </react_bootstrap_1.Navbar>);
};
exports.default = Header;
