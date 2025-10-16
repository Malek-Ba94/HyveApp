import axios from "axios";
const API_URL = "https://hyve-server-zsp9.onrender.com";

export const createOrder = async (orderData) => {
  return axios.post(API_URL, orderData);
};

export const getUserOrders = async (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

export const cancelOrder = async (orderId) => {
  return axios.put(`${API_URL}/cancel/${orderId}`);
};
