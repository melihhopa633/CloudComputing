import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5002/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tasks by user ID
  getTasksByUserId: async (userId) => {
    try {
      const response = await api.get(`/tasks/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user's tasks
  getCurrentUserTasks: async () => {
    try {
      const response = await api.get("/tasks/user/current");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task status statistics
  getTaskStatus: async () => {
    try {
      const response = await api.get("/tasks/status");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    try {
      const response = await api.put(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default taskService;
