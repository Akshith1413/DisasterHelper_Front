import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const googleLogin = (token) => api.post('/auth/google', { token });
export const githubLogin = (code) => api.post('/auth/github', { code });
export const getMe = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');

// Disasters
export const getDisasters = (params) => api.get('/disasters', { params });
export const getDisaster = (id) => api.get(`/disasters/${id}`);

// Relocations
export const getRelocations = (params) => api.get('/relocations', { params });
export const generateRelocations = (data) => api.post('/relocations', data);

// Weather
export const getWeather = (city) => api.get('/weather', { params: { city } });

// Air Quality
export const getAirQuality = (city) => api.get('/airquality', { params: { city } });

// Cost of Living
export const getCostOfLiving = (city) => api.get('/cost-of-living', { params: { city } });

// User
export const updateProfile = (data) => api.put('/user/profile', data);
export const getSavedLocations = () => api.get('/user/saved-locations');
export const saveLocation = (data) => api.post('/user/saved-locations', data);
export const removeSavedLocation = (id) => api.delete(`/user/saved-locations/${id}`);

export default api;
