import axios from 'axios'

const instance = axios.create({
  baseURL: "https://service-system-backend.herokuapp.com/",
});

export default instance