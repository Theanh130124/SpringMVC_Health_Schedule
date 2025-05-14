"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authformdataApis = exports.authApis = exports.fbApis = exports.endpoint = void 0;
const axios_1 = __importDefault(require("axios"));
const react_cookies_1 = __importDefault(require("react-cookies"));
const BASE_URL_FIREBASE = 'http://127.0.0.1:5001/healthapp-a5a6d/us-central1/app';
//CÓ THAY ĐỔI 
const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/';
exports.endpoint = {
    'users': '/users',
    'doctor_license': '/doctor_license',
    'doctor': '/doctor',
    'register': '/users',
    'current_user': '/secure/profile',
    'login': '/login',
    'findDoctor': '/find_slot',
    findDoctorById: (doctorId) => `/find_slot?doctorId=${doctorId}`,
    'listAppointment': '/appointment',
    'bookdoctor': '/book_doctor',
    updateBookDoctor: (appointmentId) => `/book_doctor/${appointmentId}`,
    deleteBookDoctor: (appointmentId) => `/delete_booking/${appointmentId}`,
    'reviews': '/reviews',
    'review': '/review',
    'availability': '/doctor_availability',
    updateAvailability: (availabilityId) => `/doctor_availability/${availabilityId}`,
    getAvailability: (doctorId) => `/doctor_availability/${doctorId}`,
    // Cho firebase
    'chats': '/chats',
    'uploadImage': '/upload-image',
    chatMessages: (chatId) => `/chats/${chatId}/messages`,
};
const fbApis = () => {
    return axios_1.default.create({
        baseURL: BASE_URL_FIREBASE,
        // headers: {
        //     'Authorization' : `Bearer ${cookie.load('token')}`,
        //     'Content-Type' : 'application/x-www-form-urlencoded'
        // }
    });
};
exports.fbApis = fbApis;
//json
const authApis = () => {
    return axios_1.default.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${react_cookies_1.default.load('token')}`,
            //Bổ sung để lưu from
            'Content-Type': 'application/json'
        }
    });
};
exports.authApis = authApis;
const authformdataApis = () => {
    return axios_1.default.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${react_cookies_1.default.load('token')}`,
            //Bổ sung để lưu from
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};
exports.authformdataApis = authformdataApis;
exports.default = axios_1.default.create({
    baseURL: BASE_URL
});
// export const authApis = () => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             'Authorization' : `Bearer ${cookies.load(token)}`
//         }
//     })
// }
