import React, { useState, useEffect } from 'react';
import {
   Box,
   Tabs,
   Tab,
   Paper,
   Typography,
   Grid,
   Card,
   CardContent,
   CardActions,
   Button,
   CircularProgress,
   Alert,
   Chip,
   Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import { format } from 'date-fns';

const TasksPage = () => {
   const [selectedTab, setSelectedTab] = useState(0);
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      fetchTasks();
   }, []);

   const fetchTasks = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await taskService.getAllTasks();
         if (response.success) {
            setTasks(response.data);
         } else {
            setError(response.message || 'Failed to fetch tasks');
         }
      } catch (err) {
         console.error('Error in fetchTasks:', err);
         setError(err.message || 'Failed to connect to the server. Please check if the backend is running.');
      } finally {
         setLoading(false);
      }
   };

   const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
      switch (newValue) {
         case 0:
            navigate('/tasks/all');
            break;
         case 1:
            navigate('/tasks/create');
            break;
         case 2:
            navigate('/tasks/status');
            break;
         case 3:
            navigate('/tasks/user');
            break;
         default:
            break;
      }
   };

   const handleStartTask = async (serviceType) => {
      try {
         const response = await taskService.createTask({
            serviceType,
            userId: 'current-user-id' // TODO: Get from auth context
         });
         if (response.success) {
            await fetchTasks();
         }
      } catch (err) {
         setError('Failed to start task');
      }
   };

   const handleStopTask = async (taskId) => {
      try {
         const response = await taskService.deleteTask(taskId);
         if (response.success) {
            await fetchTasks();
         }
      } catch (err) {
         setError('Failed to stop task');
      }
   };

   const getStatusColor = (status) => {
      switch (status) {
         case 'Running':
            return 'success';
         case 'Stopped':
            return 'error';
         case 'Error':
            return 'error';
         default:
            return 'default';
      }
   };

   const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'PPpp');
   };

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
            <Button
               variant="contained"
               color="primary"
               onClick={fetchTasks}
            >
               Retry
            </Button>
         </Box>
      );
   }

   return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
         <Paper sx={{ width: '100%', mb: 2 }}>
            <Tabs
               value={selectedTab}
               onChange={handleTabChange}
               indicatorColor="primary"
               textColor="primary"
               variant="fullWidth"
            >
               <Tab label="All Tasks" />
               <Tab label="Create Task" />
               <Tab label="Task Status" />
               <Tab label="User Tasks" />
            </Tabs>
         </Paper>

         <Box sx={{ flex: 1, p: 2 }}>
            <Grid container spacing={2}>
               {tasks.map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task.id}>
                     <Card>
                        <CardContent>
                           <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                              <Typography variant="h6" component="div">
                                 {task.serviceType}
                              </Typography>
                              <Chip
                                 label={task.status}
                                 color={getStatusColor(task.status)}
                                 size="small"
                              />
                           </Stack>

                           <Typography color="text.secondary" gutterBottom>
                              Port: {task.port}
                           </Typography>

                           <Typography variant="body2" color="text.secondary">
                              Started: {formatDate(task.startTime)}
                           </Typography>

                           {task.stopTime && (
                              <Typography variant="body2" color="text.secondary">
                                 Stopped: {formatDate(task.stopTime)}
                              </Typography>
                           )}

                           {task.events && task.events.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                 <Typography variant="subtitle2" gutterBottom>
                                    Events:
                                 </Typography>
                                 {task.events.map((event) => (
                                    <Typography
                                       key={event.id}
                                       variant="body2"
                                       color="text.secondary"
                                    >
                                       {formatDate(event.timestamp)} - {event.type}: {event.details}
                                    </Typography>
                                 ))}
                              </Box>
                           )}

                           {task.status === 'Running' && (
                              <Box sx={{ mt: 2, height: '300px' }}>
                                 <iframe
                                    src={`http://localhost:${task.port}`}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    title={`${task.serviceType}-${task.id}`}
                                 />
                              </Box>
                           )}
                        </CardContent>
                        <CardActions>
                           {task.status === 'Running' ? (
                              <Button
                                 size="small"
                                 color="error"
                                 onClick={() => handleStopTask(task.id)}
                              >
                                 Stop
                              </Button>
                           ) : (
                              <Button
                                 size="small"
                                 color="primary"
                                 onClick={() => handleStartTask(task.serviceType)}
                              >
                                 Start
                              </Button>
                           )}
                        </CardActions>
                     </Card>
                  </Grid>
               ))}
            </Grid>
         </Box>
      </Box>
   );
};

export default TasksPage; 