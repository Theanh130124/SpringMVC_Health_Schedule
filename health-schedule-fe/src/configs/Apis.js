import axios from "axios"
import cookie from 'react-cookies'




const BASE_URL_FIREBASE = 'http://127.0.0.1:5001/healthapp-a5a6d/us-central1/app'

//CÓ THAY ĐỔI 
const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'


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
    updateBookDoctor : (appointmentId) => `/book_doctor/${appointmentId}`,
    'reviews': '/reviews',
    'review': '/review',

    
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
            'Content-Type' : 'application/x-www-form-urlencoded'
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