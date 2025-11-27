import axios from "axios";

const API = axios.create({
  baseURL: "https://kiwendaserver.onrender.com", // ✅ uses Vercel environment variable
});

export default API;
