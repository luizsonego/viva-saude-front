import axios from "axios";
import { getToken, logout } from "./auth";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se o erro é 401 (não autorizado) ou se o token é inválido
    if (error.response?.status === 401) {
      // Remove o token e redireciona para login
      logout();
    }
    return Promise.reject(error);
  }
);

export default api;
