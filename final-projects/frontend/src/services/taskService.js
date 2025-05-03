import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:5002/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const taskService = {
    // Get all tasks
    getAllTasks: async () => {
        try {
            console.log('Fetching tasks from:', `${api.defaults.baseURL}/tasks`);
            const response = await api.get('/tasks');
            console.log('Tasks response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
            }
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
            const response = await api.post('/tasks', taskData);
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
            const response = await api.get('/tasks/user/current');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get task status statistics
    getTaskStatus: async () => {
        try {
            const response = await api.get('/tasks/status');
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
    }
};

export default taskService; 