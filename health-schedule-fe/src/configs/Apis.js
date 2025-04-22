import axios from "axios"
import { cookies } from "react-cookie"

const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'


export const endpoint = {
    'users' : '/users',
    'doctor_license': '/doctor_license',
    'doctor': '/doctor',
    'register':'/users',
    'current_user':'/secure/profile'
   
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