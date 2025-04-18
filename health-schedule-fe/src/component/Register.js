import { useState } from "react";
import { Spinner } from "react-bootstrap";

const Register = () => {

    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading && <Spinner animation="border" role="status">
                <span className="visually-hidden">Đang tải...</span>
            </Spinner>}
        </>
    )
}

export default Register