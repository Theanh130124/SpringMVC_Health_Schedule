import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './component/layout/Header';
import Footer from './component/layout/Footer';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import { Container } from 'react-bootstrap';



const App = () => {
  return (

    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  
  )
}

export default App;
