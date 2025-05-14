"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const MyConfirm = ({ show, onHide, onConfirm, loading, title, body, nav }) => {
    return (<react_bootstrap_1.Modal show={show} onHide={onHide}>
            <react_bootstrap_1.Modal.Header closeButton>
                <react_bootstrap_1.Modal.Title>{title || "Xác nhận"}</react_bootstrap_1.Modal.Title>
            </react_bootstrap_1.Modal.Header>
            <react_bootstrap_1.Modal.Body>{body || "Bạn có chắc chắn muốn thực hiện hành động này không?"}</react_bootstrap_1.Modal.Body>
            <react_bootstrap_1.Modal.Footer>
                <react_bootstrap_1.Button variant="secondary" onClick={onHide}>
                    Hủy
                </react_bootstrap_1.Button>
                <react_bootstrap_1.Button variant="success" onClick={onConfirm} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                </react_bootstrap_1.Button>
            </react_bootstrap_1.Modal.Footer>
        </react_bootstrap_1.Modal>);
};
exports.default = MyConfirm;
