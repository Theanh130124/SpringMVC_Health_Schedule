import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './component/layout/Header';
import Footer from './component/layout/Footer';
import MyToaster from './component/layout/MyToaster';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import { Container} from 'react-bootstrap';
import toast, { Toaster } from "react-hot-toast"
import Finddoctor from './component/Finddoctor';
import { generateToken, messaging } from './notifications/firebase';
import {useEffect} from "react"
import { onMessage } from 'firebase/messaging';



const App = () => {


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

    <BrowserRouter>
      <Header />
      <Container fluid >
        <MyToaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findDoctor" element={<Finddoctor />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>

  )
}

export default App;
