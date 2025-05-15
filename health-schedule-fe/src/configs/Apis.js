import axios from "axios"
import cookie from 'react-cookies'


const AI_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = "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";
export const BASE_URL_FIREBASE = 'http://127.0.0.1:5001/healthapp-a5a6d/us-central1/app'

//CÓ THAY ĐỔI 
const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'

export const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dxiawzgnz/image/upload";
export const CLOUDINARY_PRESET = "healthapp";




export const endpoint = {
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
    deleteAvailability: (availabilityId) => `/doctor_availability/${availabilityId}`,

    // Cho firebase
    'chats': '/chats',
    'uploadImage': '/upload-image',

    chatMessages: (chatId) => `/chats/${chatId}/messages`,


}




export const fbApis = () => {
    return axios.create({
        baseURL: BASE_URL_FIREBASE,
        // headers: {
        //     'Authorization' : `Bearer ${cookie.load('token')}`,
        //     'Content-Type' : 'application/x-www-form-urlencoded'
        // }

    })
};

//json
export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`,
            //Bổ sung để lưu from
            'Content-Type': 'application/json'
        }
    })
}


export const authformdataApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`,
            //Bổ sung để lưu from
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}


export const apisAI = () => {
    return axios.create({
        baseURL: AI_URL,
        timeout: 50000,
        headers: {
            "Authorization": "Bearer " + OPENROUTER_API_KEY,
            "Content-Type": "application/json",
            "X-Title": "HealthCare",
            "HTTP-Referer": "http://localhost:3000/",

        }
    })


}

export default axios.create({
    baseURL: BASE_URL
})

// export const authApis = () => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             'Authorization' : `Bearer ${cookies.load(token)}`
//         }
//     })
// }