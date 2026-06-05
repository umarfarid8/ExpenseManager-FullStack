import api from './api';

export const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    
    // If the server returns a token payload, cache it in the browser's localStorage
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};