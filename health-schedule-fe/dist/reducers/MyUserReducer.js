"use strict";
// Để lưu truyền thông tin giữa các component -> rồi đi tạo context bên App.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_cookies_1 = __importDefault(require("react-cookies"));
const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            react_cookies_1.default.remove('token');
            react_cookies_1.default.remove('user');
            return null;
    }
    return currentState;
};
exports.default = MyUserReducer;
