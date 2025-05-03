import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import {
   Box,
   Typography,
   Paper,
   CircularProgress,
   Grid,
   Card,
   CardContent,
   Alert,
} from '@mui/material';

const TaskStatus = () => {
   const [stats, setStats] = useState({
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      failed: 0,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      fetchTaskStats();
   }, []);

   const fetchTaskStats = async () => {
      try {
         const response = await taskService.getTaskStatus();
         setStats(response.data);
         setLoading(false);
         setError(null);
      } catch (err) {
         setError('Failed to fetch task statistics');
         setLoading(false);
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
            <Alert severity="error">{error}</Alert>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h5" gutterBottom>
            Task Status Overview
         </Typography>
         <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
               <Card>
                  <CardContent>
                     <Typography color="textSecondary" gutterBottom>
                        Total Tasks
                     </Typography>
                     <Typography variant="h4">
                        {stats.total}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <Card>
                  <CardContent>
                     <Typography color="textSecondary" gutterBottom>
                        Completed
                     </Typography>
                     <Typography variant="h4" color="success.main">
                        {stats.completed}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <Card>
                  <CardContent>
                     <Typography color="textSecondary" gutterBottom>
                        In Progress
                     </Typography>
                     <Typography variant="h4" color="info.main">
                        {stats.inProgress}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <Card>
                  <CardContent>
                     <Typography color="textSecondary" gutterBottom>
                        Pending
                     </Typography>
                     <Typography variant="h4" color="warning.main">
                        {stats.pending}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
               <Card>
                  <CardContent>
                     <Typography color="textSecondary" gutterBottom>
                        Failed
                     </Typography>
                     <Typography variant="h4" color="error.main">
                        {stats.failed}
                     </Typography>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
};

export default TaskStatus; 