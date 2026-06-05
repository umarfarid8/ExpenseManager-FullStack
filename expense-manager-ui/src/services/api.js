import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7222/api', // Must match your Visual Studio running port
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Runs automatically right before ANY network call is sent
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // If a user token exists in local storage, inject it into the Authorization Bearer Header
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;