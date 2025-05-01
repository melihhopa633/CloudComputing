import axiosInstance from '../utils/axiosInstance';

const API_URL = 'http://localhost:5001/api/users';

const userService = {
  async getAll() {
    try {
      const response = await axiosInstance.get(API_URL);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  async create(user) {
    try {
      const response = await axiosInstance.post(API_URL, user);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Email already registered');
      }
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  async update(id, user) {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, user);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  async getById(id) {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }
};

export default userService;
