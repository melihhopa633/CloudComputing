import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import {
   Box,
   Typography,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Button,
   CircularProgress,
   Alert,
} from '@mui/material';

const UserTasks = () => {
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      fetchUserTasks();
   }, []);

   const fetchUserTasks = async () => {
      try {
         const response = await axios.get('/api/tasks/user/current');
         setTasks(response.data.data);
         setLoading(false);
      } catch (err) {
         setError('Failed to fetch user tasks');
         setLoading(false);
      }
   };

   const handleDelete = async (taskId) => {
      try {
         await axios.delete(`/api/tasks/${taskId}`);
         fetchUserTasks();
      } catch (err) {
         setError('Failed to delete task');
      }
   };

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h5" gutterBottom>
            My Tasks
         </Typography>
         <TableContainer component={Paper}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Task ID</TableCell>
                     <TableCell>Title</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Service Type</TableCell>
                     <TableCell>Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tasks.map((task) => (
                     <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>{task.serviceType}</TableCell>
                        <TableCell>
                           <Button
                              color="primary"
                              onClick={() => window.parent.location.href = `/tasks/${task.id}`}
                           >
                              View
                           </Button>
                           <Button
                              color="error"
                              onClick={() => handleDelete(task.id)}
                           >
                              Delete
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Box>
   );
};

export default UserTasks; 