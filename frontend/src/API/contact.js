import axios from "axios";
const API_URL = "https://hyve-server-zsp9.onrender.com/api/contact";

export const sendMessage = async (data) => {
  return axios.post(API_URL, data);
};
