"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logo_svg_1 = __importDefault(require("./logo.svg"));
require("./App.css");
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./component/layout/Header"));
const Footer_1 = __importDefault(require("./component/layout/Footer"));
const MyToaster_1 = __importDefault(require("./component/layout/MyToaster"));
const Home_1 = __importDefault(require("./component/Home"));
const Register_1 = __importDefault(require("./component/Register"));
const Login_1 = __importDefault(require("./component/Login"));
const react_bootstrap_1 = require("react-bootstrap");
const react_hot_toast_1 = __importStar(require("react-hot-toast"));
const Finddoctor_1 = __importDefault(require("./component/findDoctor/Finddoctor"));
const firebase_1 = require("./notifications/firebase");
const react_1 = require("react");
const messaging_1 = require("firebase/messaging");
const MyUserReducer_1 = __importDefault(require("./reducers/MyUserReducer"));
const MyContexts_1 = require("./configs/MyContexts");
const react_cookies_1 = __importDefault(require("react-cookies"));
const Booking_1 = __importDefault(require("./component/bookDoctor/Booking"));
const Calendar_1 = __importDefault(require("./component/findDoctor/Calendar"));
const UploadLicense_1 = __importDefault(require("./component/UploadLicense"));
const Appointment_1 = __importDefault(require("./component/bookDoctor/Appointment"));
const CallVideo_1 = __importDefault(require("./component/CallVideo"));
const RoomChat_1 = __importDefault(require("./component/RoomChat"));
const Review_1 = __importDefault(require("./component/reviewDoctor/Review"));
const react_2 = require("react");
const PaymentMethod_1 = __importDefault(require("./component/PaymentMethod"));
const VNPayReturn_1 = __importDefault(require("./component/VNPayReturn"));
const Invoice_1 = __importDefault(require("./component/Invoice"));
const AppointmentUpdate_1 = __importDefault(require("./component/bookDoctor/AppointmentUpdate"));
const EditProfile_1 = __importDefault(require("./component/EditProfile"));
const ChangePassword_1 = __importDefault(require("./component/ChangePassword"));
const DoctorAvailability_1 = __importDefault(require("./component/bookDoctor/DoctorAvailability"));
const App = () => {
    //dispatch nhận action.type bên MyUserReducer.js -> F5 sẽ không mất vì đã lưu cookie
    const [user, dispatch] = (0, react_1.useReducer)(MyUserReducer_1.default, react_cookies_1.default.load('user') || null);
    //Phần xử lý token cho notifications
    (0, react_1.useEffect)(() => {
        (0, firebase_1.generateToken)();
        (0, messaging_1.onMessage)(firebase_1.messaging, (payload) => {
            console.log(payload);
            (0, react_hot_toast_1.default)(payload.notification.body);
        });
    }, []);
    return (<MyContexts_1.MyUserContext.Provider value={user}>
      <MyContexts_1.MyDipatcherContext.Provider value={dispatch}>
        <react_router_dom_1.BrowserRouter>
          <Header_1.default />
          <react_bootstrap_1.Container fluid>
            <MyToaster_1.default />
            <react_router_dom_1.Routes>
              {/* Permission lại bên BE */}
             
              <react_router_dom_1.Route path="/doctorAvailability" element={<DoctorAvailability_1.default />}/>
              <react_router_dom_1.Route path="/callvideo" element={<CallVideo_1.default />}/>
              <react_router_dom_1.Route path="/updateAppointment" element={<AppointmentUpdate_1.default />}/>
              <react_router_dom_1.Route path="/roomchat" element={<RoomChat_1.default />}/>
              <react_router_dom_1.Route path="/appointment" element={<Appointment_1.default />}/>
              <react_router_dom_1.Route path="/callvideo" element={<CallVideo_1.default />}/>
              <react_router_dom_1.Route path="/uploadLicense" element={<UploadLicense_1.default />}/>
              <react_router_dom_1.Route path="/calendar" element={<Calendar_1.default />}/>
              <react_router_dom_1.Route path="/booking" element={<Booking_1.default />}/>
              <react_router_dom_1.Route path="/" element={<Home_1.default />}/>
              <react_router_dom_1.Route path="/register" element={<Register_1.default />}/>
              <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
              <react_router_dom_1.Route path="/findDoctor" element={<Finddoctor_1.default />}/>
              <react_router_dom_1.Route path="/review" element={<Review_1.default />}/>
              <react_router_dom_1.Route path="/payment-method" element={<PaymentMethod_1.default />}/>
              <react_router_dom_1.Route path="/vnpay-return" element={<VNPayReturn_1.default />}/>
              <react_router_dom_1.Route path="/invoice" element={<Invoice_1.default />}/>
              <react_router_dom_1.Route path="/editProfile" element={<EditProfile_1.default />}/>
              <react_router_dom_1.Route path="/change-password" element={<ChangePassword_1.default />}/>
            </react_router_dom_1.Routes>
          </react_bootstrap_1.Container>
          <Footer_1.default />
        </react_router_dom_1.BrowserRouter>
      </MyContexts_1.MyDipatcherContext.Provider>
    </MyContexts_1.MyUserContext.Provider>);
};
exports.default = App;
