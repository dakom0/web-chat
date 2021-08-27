import axios from 'axios'

const instance = axios.create({

    baseURL: "https://whatsapp-backend-pusher.herokuapp.com"
})

export default instance;