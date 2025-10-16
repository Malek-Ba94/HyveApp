import axios from "axios";
const API_URL = "http://localhost:7200/api/contact";

export const sendMessage = async (data) => {
  return axios.post(API_URL, data);
};
