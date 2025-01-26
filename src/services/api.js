import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

const thisPath = window.location.pathname;

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!token && thisPath !== "/login") {
    window.location.assign(`/login`);
  }

  return config;
});

export default api;
