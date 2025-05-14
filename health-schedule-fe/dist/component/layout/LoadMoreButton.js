"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const LoadMoreButton = ({ hasMore, loading, onClick }) => {
    if (!hasMore || loading)
        return null;
    return (<react_bootstrap_1.Row className="justify-content-center align-items-center g-4 mb-4 mt-4">
            <react_bootstrap_1.Col xs="auto">
                <react_bootstrap_1.Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={onClick}>
                    Xem thêm
                </react_bootstrap_1.Button>
            </react_bootstrap_1.Col>
        </react_bootstrap_1.Row>);
};
exports.default = LoadMoreButton;
