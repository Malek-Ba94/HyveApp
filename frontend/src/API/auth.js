
import axios from "axios";
const API_URL = "https://hyve-server-zsp9.onrender.com";

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const forgotPassword = async (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

export const addTrip = async (userId, trip) => {
  return axios.post(`${API_URL}/add-trip`, { userId, trip });
};

export const removeTrip = (userId, tripId) => {
  return axios.post(`${API_URL}/remove-trip`, { userId, tripId });
};

export const toggleFav = async (userId, fav) => {
  try {
    const res = await axios.post(`${API_URL}/toggle-fav`, { userId, fav });
    return res;
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};
