import axios from "axios";

const API_URL = "http://localhost:5001/api/auth"; // adjust the URL based on your backend

const authService = {
  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("roles", JSON.stringify(response.data.roles));
      localStorage.setItem("userId", response.data.userId);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("roles");
  },

  isAdmin() {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    return roles.includes("Admin");
  },

  getRoles() {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  },
};

export default authService;
