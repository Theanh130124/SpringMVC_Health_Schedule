import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './component/layout/Header';
import Footer from './component/layout/Footer';
import MyToaster from './component/layout/MyToaster';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import { Container } from 'react-bootstrap';
import toast, { Toaster } from "react-hot-toast"
import Finddoctor from './component/findDoctor/Finddoctor';
import { generateToken, messaging } from './notifications/firebase';
import { createContext, useEffect, useReducer } from "react"
import { onMessage } from 'firebase/messaging';
import MyUserReducer from './reducers/MyUserReducer';
import { MyDipatcherContext, MyUserContext, MyDoctorContext } from './configs/MyContexts';
import cookie from 'react-cookies'
import Booking from './component/bookDoctor/Booking';
import Calendar from './component/findDoctor/Calendar';
import UploadLicense from './component/UploadLicense';
import Appointment from './component/bookDoctor/Appointment';
import CallVideo from './component/CallVideo';
import RoomChat from './component/RoomChat';
import Review from './component/reviewDoctor/Review';
import { useState } from 'react';
import PaymentMethod from './component/PaymentMethod';
import VNPayReturn from './component/VNPayReturn';
import Invoice from './component/Invoice';


const App = () => {
  //dispatch nhận action.type bên MyUserReducer.js -> F5 sẽ không mất vì đã lưu cookie

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load('user') || null);
  const [doctor, setDoctor] = useState({});




  //Phần xử lý token cho notifications
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification.body);
    })
  }
    , [])
  return (
    <MyDoctorContext.Provider value={[doctor,setDoctor]}>
    <MyUserContext.Provider value={user}>
      <MyDipatcherContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container fluid >
            <MyToaster />
            <Routes>
{/* Permission lại bên BE */}


              <Route path="/roomchat" element={<RoomChat/>} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/callvideo" element={<CallVideo/>} />
              <Route path="/uploadLicense" element={<UploadLicense />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/findDoctor" element={<Finddoctor />} />
              <Route path="/review" element={<Review />} />
              <Route path="/payment-method" element={<PaymentMethod />} />
              <Route path="/vnpay-return" element={<VNPayReturn />} />
              <Route path="/invoice" element={<Invoice />} />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDipatcherContext.Provider>
    </MyUserContext.Provider>
    </MyDoctorContext.Provider>

  )
}

export default App;
