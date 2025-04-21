import axios from "axios"

const BASE_URL = 'http://localhost:8080/SpringMVC_Health_Schedule/api/'


export const endpoint = {
    'users' : '/users',
    'doctor_license': '/doctor_license',
    'doctor': '/doctor'
   
}

export default axios.create({
    baseURL : BASE_URL
})