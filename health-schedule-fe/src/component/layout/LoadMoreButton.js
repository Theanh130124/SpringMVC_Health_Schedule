import React from "react";
import { Button, Col, Row } from "react-bootstrap";


const LoadMoreButton = ({ hasMore, loading, onClick }) => {
    if (!hasMore || loading) return null;

    return (
        <Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
            <Col xs="auto">
                <Button
                    variant="primary"
                    className="rounded-pill px-4 shadow-sm"
                    onClick={onClick}
                >
                    Xem thêm
                </Button>
            </Col>
        </Row>
    );
};
export default LoadMoreButton;