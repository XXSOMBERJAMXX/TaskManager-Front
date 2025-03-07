// AuthServices.js

import { httpRequest } from "../httpInterceptor"; // Importar el interceptor

export const login = async (email, password) => {
  return httpRequest("/login", "POST", { email, password }); // Usar el interceptor
};

export const register = async (email, username, password) => {
  return httpRequest("/register", "POST", { email, username, password }); // Usar el interceptor
};