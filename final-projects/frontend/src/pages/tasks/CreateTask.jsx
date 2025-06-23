import React, { useState } from 'react';
import taskService from '../../services/taskService';
import {
   Box,
   TextField,
   Button,
   Typography,
   Paper,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Alert,
} from '@mui/material';

const CreateTask = () => {
   const [formData, setFormData] = useState({
      title: '',
      description: '',
      serviceType: '',
      priority: 'medium',
   });
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const userId = localStorage.getItem('userId');
         console.log('UserId from localStorage:', userId, 'Type:', typeof userId);

         if (!userId || userId === 'null' || userId === 'undefined') {
            setError('User not logged in. Please login again.');
            return;
         }

         // GUID format validation (simple check)
         const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
         if (!guidRegex.test(userId)) {
            setError('Invalid user ID format. Please login again.');
            console.error('Invalid userId format:', userId);
            return;
         }

         const taskData = {
            userId: userId,
            serviceType: formData.serviceType,
            containerId: '' // Bu backend tarafında doldurulacak
         };
         console.log('Task data being sent:', taskData);
         await taskService.createTask(taskData);
         setSuccess(true);
         setError(null);
         // Reset form
         setFormData({
            title: '',
            description: '',
            serviceType: '',
            priority: 'medium',
         });
         // Redirect after 2 seconds
         setTimeout(() => {
            window.parent.location.href = '/tasks';
         }, 2000);
      } catch (err) {
         console.error('Task creation error:', err);
         setError('Failed to create task: ' + (err.response?.data?.message || err.message));
         setSuccess(false);
      }
   };

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h5" gutterBottom>
            Create New Task
         </Typography>
         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
         {success && <Alert severity="success" sx={{ mb: 2 }}>Task created successfully!</Alert>}
         <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
               <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  required
               />
               <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
               />
               <FormControl fullWidth margin="normal">
                  <InputLabel>Service Type</InputLabel>
                  <Select
                     name="serviceType"
                     value={formData.serviceType}
                     onChange={handleChange}
                     required
                  >
                     <MenuItem value="compute">Compute</MenuItem>
                     <MenuItem value="storage">Storage</MenuItem>
                     <MenuItem value="network">Network</MenuItem>
                     <MenuItem value="database">Database</MenuItem>
                  </Select>
               </FormControl>
               <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                     name="priority"
                     value={formData.priority}
                     onChange={handleChange}
                     required
                  >
                     <MenuItem value="low">Low</MenuItem>
                     <MenuItem value="medium">Medium</MenuItem>
                     <MenuItem value="high">High</MenuItem>
                  </Select>
               </FormControl>
               <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
               >
                  Create Task
               </Button>
            </form>
         </Paper>
      </Box>
   );
};

export default CreateTask; 