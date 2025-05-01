import axiosInstance from '../utils/axiosInstance';

const API_URL = 'http://localhost:5001/api/userroles';

const userRoleService = {
  async getAll() {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user roles');
    }
  },

  async create(userRole) {
    try {
      const response = await axiosInstance.post(API_URL, userRole);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error('User already has this role');
      }
      if (error.response?.status === 404) {
        throw new Error('User or Role not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to assign role to user');
    }
  },

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('UserRole not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to remove role from user');
    }
  },

  async getById(id) {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('UserRole not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user role');
    }
  }
};

export default userRoleService; 