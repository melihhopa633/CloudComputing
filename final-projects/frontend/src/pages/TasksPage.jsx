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
   Stack,
   Menu,
   MenuItem,
   IconButton,
   Tooltip,
   Dialog,
   DialogContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import { format } from 'date-fns';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Servis tipine göre logo eşlemesi (sadece bir kere bakılır)
const LOGO_MAP = {
   photopea: '/logos/Photopea-logo.png',
   jupyter: '/logos/jupyter-logo.png',
   excalidraw: '/logos/excalidraw-logo.png',
   drawio: '/logos/drawio-logo.svg.png',
   theia: '/logos/theia-logo.png',
   filebrowser: '/logos/filebrowser-logo.png',
   adminer: '/logos/adminer-logo.png',
   directus: '/logos/directus-logo.png',
   jsoneditor: '/logos/jsoneditor-logo.png',
   trilium: '/logos/trilium-logo.png',
   snapdrop: '/logos/snapdrop-logo.png',

   // Diğer servisler için ekle
};
const DEFAULT_LOGO = '/logo192.png';

const TasksPage = () => {
   const [selectedTab, setSelectedTab] = useState(0);
   const [tasks, setTasks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const navigate = useNavigate();
   const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const [modalOpen, setModalOpen] = useState(false);
   const [modalUrl, setModalUrl] = useState('');
   const [modalTitle, setModalTitle] = useState('');
   const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
   const userMenuOpen = Boolean(userMenuAnchorEl);

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

   const handleSortMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleSortMenuClose = () => {
      setAnchorEl(null);
   };
   const handleSortChange = (order) => {
      setSortOrder(order);
      setAnchorEl(null);
   };

   const handleLogoClick = (task) => {
      setModalUrl(`http://localhost:${task.port}`);
      setModalTitle(task.serviceType);
      setModalOpen(true);
   };
   const handleModalClose = () => {
      setModalOpen(false);
      setModalUrl('');
      setModalTitle('');
   };

   const handleUserMenuClick = (event) => {
      setUserMenuAnchorEl(event.currentTarget);
   };
   const handleUserMenuClose = () => {
      setUserMenuAnchorEl(null);
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
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0e2235' }}>
         <Box sx={{ flex: 1, p: 4, position: 'relative' }}>
            {/* FILTERING butonu ana konteynırın sağ üst köşesinde */}
            <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1200 }}>
               <Tooltip title="Sort Alphabetically">
                  <Button
                     onClick={handleSortMenuClick}
                     variant="contained"
                     startIcon={<SortIcon sx={{ fontSize: 28 }} />}
                     sx={{
                        background: '#13263a',
                        color: '#90caf9',
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18)',
                        '&:hover': { background: '#1a3552', color: '#fff' },
                        letterSpacing: 1,
                        minWidth: 180,
                     }}
                  >
                     FILTERING
                  </Button>
               </Tooltip>
               <Menu anchorEl={anchorEl} open={open} onClose={handleSortMenuClose}
                  PaperProps={{
                     sx: {
                        backgroundColor: '#13263a',
                        color: '#90caf9',
                        borderRadius: 2,
                        minWidth: 180,
                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.25)'
                     }
                  }}
                  MenuListProps={{
                     sx: { p: 0 }
                  }}
               >
                  <MenuItem onClick={() => handleSortChange('asc')} sx={{ fontWeight: sortOrder === 'asc' ? 700 : 400, fontSize: 16, justifyContent: 'center', '&:hover': { background: '#1a3552' }, color: '#90caf9' }}>
                     From A To Z
                  </MenuItem>
                  <MenuItem onClick={() => handleSortChange('desc')} sx={{ fontWeight: sortOrder === 'desc' ? 700 : 400, fontSize: 16, justifyContent: 'center', '&:hover': { background: '#1a3552' }, color: '#90caf9' }}>
                     From Z To A
                  </MenuItem>
               </Menu>
            </Box>
            <Box sx={{ mt: 6 }} />
            <Grid container spacing={4} alignItems="stretch">
               {tasks
                  .filter((task) => task.status === 'Running')
                  .slice() // orijinal diziyi bozmamak için kopya al
                  .sort((a, b) => {
                     const cmp = (a.serviceType?.toLowerCase() || '').localeCompare(b.serviceType?.toLowerCase() || '');
                     return sortOrder === 'asc' ? cmp : -cmp;
                  })
                  .map((task) => (
                     <Grid item xs={12} sm={6} md={4} lg={3} key={task.id} sx={{ display: 'flex', height: 1 }}>
                        <Card sx={{
                           height: '100%',
                           minHeight: 420,
                           maxHeight: 420,
                           width: '100%',
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'space-between',
                           background: '#204060',
                           color: '#e3f2fd',
                           borderRadius: 4,
                           boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                           p: 0,
                           position: 'relative',
                           flex: 1,
                        }}>
                           <CardContent sx={{ flex: 1, p: 3, pb: '16px!important', position: 'relative' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                 <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
                                    {task.serviceType}
                                 </Typography>
                                 <Box sx={{ ml: 2 }}>
                                    <img
                                       src={LOGO_MAP[task.serviceType?.toLowerCase()] || DEFAULT_LOGO}
                                       alt={task.serviceType + ' logo'}
                                       style={{ width: 64, height: 64, borderRadius: 12, background: '#18304a', objectFit: 'contain', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', cursor: 'pointer' }}
                                       onClick={() => handleLogoClick(task)}
                                    />
                                 </Box>
                              </Box>
                              <Chip
                                 label={task.status}
                                 sx={{
                                    background: '#2e8b6e',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 18,
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 0.5,
                                    mb: 2,
                                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
                                 }}
                              />
                              <Typography variant="body1" sx={{ color: '#e3f2fd', fontWeight: 500, mt: 1 }}>
                                 <b>Port:</b> {task.port}
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#e3f2fd', fontWeight: 500 }}>
                                 <b>Started:</b> {formatDate(task.startTime)}
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#e3f2fd', fontWeight: 700, mt: 2 }}>
                                 Events:
                              </Typography>
                              {task.events && task.events.length > 0 && (
                                 <Box>
                                    {task.events.map((event) => (
                                       <Typography
                                          key={event.id}
                                          variant="body2"
                                          sx={{ color: '#e3f2fd', fontWeight: 400 }}
                                       >
                                          {formatDate(event.timestamp)} - {event.type}: {event.details}
                                       </Typography>
                                    ))}
                                 </Box>
                              )}
                           </CardContent>
                           <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                              <Button
                                 size="large"
                                 sx={{
                                    background: '#18304a',
                                    color: '#e3f2fd',
                                    fontWeight: 700,
                                    fontSize: 20,
                                    borderRadius: 2,
                                    px: 6,
                                    py: 1.5,
                                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18), 0 8px 32px 0 rgba(32,64,96,0.18)',
                                    '&:hover': {
                                       background: '#2e8b6e',
                                       color: '#fff',
                                    },
                                    transition: 'background 0.2s, color 0.2s',
                                    mt: 2,
                                    mb: 1,
                                 }}
                                 onClick={() => handleStopTask(task.id)}
                              >
                                 STOP
                              </Button>
                           </CardActions>
                        </Card>
                     </Grid>
                  ))}
            </Grid>
         </Box>
         {/* Modal: Servis sitesini büyük popup olarak göster */}
         <Dialog open={modalOpen} onClose={handleModalClose} fullScreen>
            <DialogContent sx={{ p: 0, background: '#0e2235' }}>
               <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Sağ üstte kapat butonu */}
                  <IconButton
                     onClick={handleModalClose}
                     sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, color: '#fff', background: 'rgba(32,64,96,0.7)', '&:hover': { background: '#2e8b6e' } }}
                  >
                     <CloseIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Box sx={{ p: 2, color: '#fff', fontWeight: 700, fontSize: 28, background: '#204060', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                     {modalTitle}
                  </Box>
                  <iframe
                     src={modalUrl}
                     title={modalTitle}
                     style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#fff' }}
                     allowFullScreen
                  />
               </Box>
            </DialogContent>
         </Dialog>
      </Box>
   );
};

export default TasksPage; 