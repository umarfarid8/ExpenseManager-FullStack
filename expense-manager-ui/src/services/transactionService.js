import api from './api';

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data;
  }
};

export const expenseService = {
  getByUserId: async (userId) => {
    const res = await api.get(`/expenses/user/${userId}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/expenses', data);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/expenses/${id}`);
  }
};

export const incomeService = {
  getByUserId: async (userId) => {
    const res = await api.get(`/incomes/user/${userId}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/incomes', data);
    return res.data;
  },
  delete: async (id) => {
    await api.delete(`/incomes/${id}`);
  }
};