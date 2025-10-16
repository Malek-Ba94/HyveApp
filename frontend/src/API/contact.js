import axios from "axios";
const API_URL = "https://hyve-server-zsp9.onrender.com";

export const sendMessage = async (data) => {
  return axios.post(API_URL, data);
};
