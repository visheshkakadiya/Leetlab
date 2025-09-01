import axios from 'axios';
import { BASE_URL } from '../constants.js';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is from the refresh token endpoint itself → do NOT retry
        if (originalRequest?.url?.includes('/auth/refreshToken')) {
            return Promise.reject(error);
        }

        // Check if it's a 401 error and we haven't already tried refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh access token
                await axiosInstance.post('/auth/refreshToken');

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // console.log('Refresh token failed or expired:', refreshError);

                // Optional: Logout or redirect to login
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
