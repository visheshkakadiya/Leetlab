import axios from 'axios';
import { BASE_URL } from '../constants.js';

const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = "https://leetlab-l889.onrender.com/api/v1";
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;