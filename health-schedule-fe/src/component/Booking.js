import { useContext, useState } from "react";
import { MyUserContext } from "../configs/MyContexts";

const Booking = () => {

    const [doctor, setDoctor] = useState([]);
    const [clinic, setClinic] = useState([]);

    const [loading, setLoading] = useState(false);

    const user = useContext(MyUserContext);


    
    const info = [
        
        
        
    ]

    return (

        <h1>Đặt lịch khám </h1>

    );
}

export default Booking;