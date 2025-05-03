import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import {
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Button,
   Typography,
   Box,
} from '@mui/material';

const AllTasks = () => {
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      fetchTasks();
   }, []);

   const fetchTasks = async () => {
      try {
         const response = await taskService.getAllTasks();
         setTasks(response.data);
         setLoading(false);
      } catch (err) {
         setError('Failed to fetch tasks');
         setLoading(false);
      }
   };

   const handleDelete = async (taskId) => {
      try {
         await taskService.deleteTask(taskId);
         fetchTasks();
      } catch (err) {
         setError('Failed to delete task');
      }
   };

   if (loading) return <Typography>Loading...</Typography>;
   if (error) return <Typography color="error">{error}</Typography>;

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h5" gutterBottom>
            All Tasks
         </Typography>
         <TableContainer component={Paper}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Task ID</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Service Type</TableCell>
                     <TableCell>Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tasks.map((task) => (
                     <TableRow key={task.id}>
                        <TableCell>{task.id}</TableCell>
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

export default AllTasks; 