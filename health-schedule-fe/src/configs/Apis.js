import axios from "axios"
import cookie from 'react-cookies'


//CÓ THAY ĐỔI 
const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'


export const endpoint = {
    'users' : '/users',
    'doctor_license': '/doctor_license',
    'doctor': '/doctor',
    'register':'/users',
    'current_user':'/secure/profile',
    'login':'/login',
    'findDoctor': '/find_slot',
    'listAppointment': '/appointment',
    'bookdoctor': '/book_doctor',
    
   
}




export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization' : `Bearer ${cookie.load('token')}`,
            //Bổ sung để lưu raw
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    })
}


export default axios.create({
    baseURL : BASE_URL
})

// export const authApis = () => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             'Authorization' : `Bearer ${cookies.load(token)}`
//         }
//     })
// }