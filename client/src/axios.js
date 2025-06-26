import axios from "axios";

const instance = axios.create({
  baseURL: "https://devsync-backend-vmun.onrender.com",
  withCredentials: false,
});

export default instance;