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
import Finddoctor from './component/Finddoctor';
import { generateToken, messaging } from './notifications/firebase';
import { createContext, useEffect, useReducer } from "react"
import { onMessage } from 'firebase/messaging';
import MyUserReducer from './reducers/MyUserReducer';
import { MyDipatcherContext, MyUserContext } from './configs/MyContexts';
import cookie from 'react-cookies'
import Booking from './component/Booking';
import Calendar from './component/Calendar';
import UploadLicense from './component/UploadLicense';



const App = () => {
  //dispatch nhận action.type bên MyUserReducer.js -> F5 sẽ không mất vì đã lưu cookie

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load('user') || null);


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
    <MyUserContext.Provider value={user}>
      <MyDipatcherContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container fluid >
            <MyToaster />
            <Routes>
              <Route path="/uploadLicense" element={<UploadLicense />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/findDoctor" element={<Finddoctor />} />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDipatcherContext.Provider>
    </MyUserContext.Provider>

  )
}

export default App;
