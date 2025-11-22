import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ uses Vercel environment variable
});

export default API;
