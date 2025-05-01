import axiosInstance from '../utils/axiosInstance';

const API_URL = 'http://localhost:5001/api/roles';

const roleService = {
  async getAll() {
    try {
      const response = await axiosInstance.get(API_URL);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },

  async create(role) {
    try {
      const response = await axiosInstance.post(API_URL, role);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('Role already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to create role');
    }
  },

  async update(id, role) {
    try {
      const response = await axiosInstance.put(`${API_URL}/${id}`, role);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Role not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update role');
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
        throw new Error('Role not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete role');
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
        throw new Error('Role not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch role');
    }
  }
};

export default roleService; 