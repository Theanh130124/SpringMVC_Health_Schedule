import React from "react";
import { Modal, Button } from "react-bootstrap";




const MyConfirm = ({ show, onHide, onConfirm, loading, title, body ,nav}) => {


    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Xác nhận"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body || "Bạn có chắc chắn muốn thực hiện hành động này không?"}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="success" onClick={onConfirm} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
            </Modal.Footer>
        </Modal>
    );

}

export default MyConfirm;