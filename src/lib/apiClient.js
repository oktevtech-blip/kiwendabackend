import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ✅ same as your backend port
});

export default API;
