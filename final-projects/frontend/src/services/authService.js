import axiosInstance from "../utils/axiosInstance";

const register = (username, email, password) => {
  return axiosInstance.post("/api/auth/register", {
    username,
    email,
    password,
  });
};

const login = async (email, password) => {
  const response = await axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
  const { token } = response.data;
  localStorage.setItem("jwtToken", token);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("jwtToken");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
