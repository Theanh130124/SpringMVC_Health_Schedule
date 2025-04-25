import axios from "axios"
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'


export const endpoint = {
    'users' : '/users',
    'doctor_license': '/doctor_license',
    'doctor': '/doctor',
    'register':'/users',
    'current_user':'/secure/profile',
    'login':'/login',
    'findDoctor': '/find_slot',
   
}




export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization' : `Bearer ${cookie.load('token')}`,
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