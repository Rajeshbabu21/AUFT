import axios from 'axios';


const api = axios.create({
    
     baseURL: import.meta.env.VITE_BACKEND_URL,
    // baseURL: 'https://auft.onrender.com/',
    // baseURL: 'http://127.0.0.1:8000',

})
console.log("AXIOS BASE URL:", import.meta.env.VITE_BACKEND_URL);



api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {  
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
