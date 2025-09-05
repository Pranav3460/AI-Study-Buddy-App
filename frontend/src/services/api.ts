import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
};

export const studyPlan = {
  create: async (data: {
    topics: { name: string; estimatedHours: number }[];
    daysUntilExam: number;
    dailyStudyHours: number;
  }) => {
    const response = await api.post('/study-plan', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/study-plan');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/study-plan/${id}`);
    return response.data;
  },
};

export default api; 