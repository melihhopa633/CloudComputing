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
   DialogContent,
   Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import { format } from 'date-fns';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import authService from '../services/authService';
import MuiAlert from '@mui/material/Alert';

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
   etherpad: '/logos/etherpad-logo.png',

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
   const [modalTaskId, setModalTaskId] = useState(null);
   const [selectedServices, setSelectedServices] = useState([]);
   const [requesting, setRequesting] = useState(false);
   const [requestError, setRequestError] = useState("");
   const [requestSuccess, setRequestSuccess] = useState("");
   const [userTasks, setUserTasks] = useState([]);
   const isAdmin = authService.isAdmin();
   const userEmail = localStorage.getItem('email');
   const [showSuccess, setShowSuccess] = useState(false);
   const userId = localStorage.getItem('userId');
   const [showRequestScreen, setShowRequestScreen] = useState(false);
   const [availableServices, setAvailableServices] = useState([]);
   const [servicesLoading, setServicesLoading] = useState(true);
   const [servicesError, setServicesError] = useState(null);

   useEffect(() => {
      fetchTasks();
   }, []);

   useEffect(() => {
      if (showRequestScreen) {
         fetchTasks();
      }
   }, [showRequestScreen]);

   useEffect(() => {
      const fetchActiveServices = async () => {
         setServicesLoading(true);
         setServicesError(null);
         try {
            // Aktif (çalışan) task'ları çek
            const response = await fetch('http://localhost:5002/api/tasks?status=Running');
            const data = await response.json();
            if (data.success) {
               // Sadece aktif servis tiplerinin unique listesini çıkar
               const activeServiceTypes = [...new Set(data.data.map(task => task.serviceType?.toLowerCase()))];
               // DockerService'deki servislerin detaylarını çek (logo vs. için)
               const allServicesResp = await fetch('http://localhost:5002/api/services');
               const allServicesData = await allServicesResp.json();
               if (allServicesData.success) {
                  // Sadece aktif olanların detaylarını al
                  const filtered = allServicesData.data.filter(svc => activeServiceTypes.includes(svc.key.toLowerCase()));
                  setAvailableServices(filtered);
               } else {
                  setServicesError('Servis detayları alınamadı');
               }
            } else {
               setServicesError(data.message || 'Aktif servisler alınamadı');
            }
         } catch (err) {
            setServicesError('Aktif servisler alınamadı');
         } finally {
            setServicesLoading(false);
         }
      };
      fetchActiveServices();
   }, []);

   const fetchTasks = async () => {
      try {
         setLoading(true);
         setError(null);
         let response;
         if (isAdmin) {
            response = await taskService.getAllTasks();
         } else {
            response = await taskService.getTasksByUserId(userId);
         }
         if (response.success) {
            setUserTasks(response.data);
            console.log("userTasks:", response.data);
         } else {
            setError(response.message || 'Failed to fetch tasks');
         }
      } catch (err) {
         setError(err.message || 'Failed to connect to the server.');
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
      setModalTaskId(task.id);
      setModalOpen(true);
   };
   const handleModalClose = async () => {
      // Metrics kaydını tetikle (asenkron - modal'ı bekletmez)
      // Sadece admin olmayan kullanıcılar için metrics gönder
      if (modalTaskId && !isAdmin) {
         // Asenkron olarak gönder, modal'ı bekletme
         axios.post(`http://localhost:5002/api/report-metrics/${modalTaskId}`)
            .then(() => {
               console.log('Metrics reported successfully');
            })
            .catch((err) => {
               console.error('Failed to report metrics:', err);
            });
      } else if (modalTaskId && isAdmin) {
         console.log('Admin user - skipping metrics report');
      }
      
      // Modal'ı hemen kapat
      setModalOpen(false);
      setModalUrl('');
      setModalTitle('');
      setModalTaskId(null);
   };

   const handleUserMenuClick = (event) => {
      setUserMenuAnchorEl(event.currentTarget);
   };
   const handleUserMenuClose = () => {
      setUserMenuAnchorEl(null);
   };

   const handleServiceToggle = (key) => {
      setSelectedServices(prev =>
         prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
   };

   const handleRequestServices = async () => {
      setRequesting(true);
      setRequestError("");
      setRequestSuccess("");
      try {
         console.log("userId:", userId);
         for (const serviceType of selectedServices) {
            await taskService.createTask({ serviceType, userId });
         }
         setRequestSuccess("Servis(ler) başarıyla talep edildi!");
         setShowSuccess(true);
         setSelectedServices([]);
         await fetchTasks();
      } catch (err) {
         let msg = "Servis talebi başarısız oldu.";
         if (err?.response?.data?.message) {
            msg = err.response.data.message;
         } else if (err?.message) {
            msg = err.message;
         }
         setRequestError(msg);
      } finally {
         setRequesting(false);
      }
   };

   return (
      <>
         {/* Loading ekranı */}
         {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
               <CircularProgress />
            </Box>
         )}

         {/* Hata ekranı */}
         {!loading && error && (
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
         )}

         {/* Admin olmayan: Aktif Servislerim veya Talep Et ekranı */}
         {!loading && !error && !isAdmin && (() => {
            const hasActiveTask = userTasks.filter(task => task.status && !['deleted', 'error'].includes(task.status.toLowerCase())).length > 0;
            const activeServiceKeys = userTasks
               .filter(task => task.status && !['deleted', 'error'].includes(task.status.toLowerCase()))
               .map(task => task.serviceType?.toLowerCase());
            if ((showSuccess || hasActiveTask) && !showRequestScreen) {
               return (
                  <Box sx={{ width: '100%', minHeight: '100vh', background: '#0e2235', p: 4 }}>
                     <Snackbar
                        open={showSuccess}
                        autoHideDuration={3000}
                        onClose={() => setShowSuccess(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                     >
                        <MuiAlert elevation={6} variant="filled" severity="success" sx={{ fontSize: 18, fontWeight: 700 }}>
                           {requestSuccess}
                        </MuiAlert>
                     </Snackbar>
                     <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
                        Aktif Servislerim
                     </Typography>
                     <Grid container spacing={4} alignItems="stretch">
                        {userTasks.filter(task => task.status && !['deleted', 'error'].includes(task.status.toLowerCase())).map(task => (
                           <Grid item xs={12} sm={6} md={4} key={task.id}>
                              <Card sx={{ minWidth: 340, maxWidth: 420, height: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#18304a', color: '#fff', borderRadius: 3, boxShadow: '0 2px 8px 0 rgba(5,130,202,0.10)', mx: 'auto' }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', letterSpacing: 0.5, textTransform: 'lowercase' }}>
                                       {task.serviceType}
                                    </Typography>
                                    <img
                                       src={LOGO_MAP[task.serviceType?.toLowerCase()] || DEFAULT_LOGO}
                                       alt={task.serviceType + ' logo'}
                                       style={{ width: 48, height: 48, borderRadius: 12, background: '#18304a', objectFit: 'contain', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', cursor: 'pointer' }}
                                       onClick={() => handleLogoClick(task)}
                                    />
                                 </Box>
                                 <Chip
                                    label={task.status}
                                    sx={{
                                       background: task.status === 'Running' ? '#2e8b6e' : '#ca8205',
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
                                 <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mt: 2, fontWeight: 700, fontSize: 16, borderRadius: 2, px: 4, py: 1, background: 'linear-gradient(90deg, #ca0505, #ca8205)', color: '#fff', boxShadow: '0 2px 8px 0 rgba(202,5,5,0.18)' }}
                                    onClick={() => handleStopTask(task.id)}
                                 >
                                    Servislerimden Çıkart
                                 </Button>
                              </Card>
                           </Grid>
                        ))}
                     </Grid>
                     <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4, fontWeight: 700, fontSize: 18, borderRadius: 2, px: 6, py: 1.5, background: 'linear-gradient(90deg, #0582CA, #05CA82)', color: '#fff', boxShadow: '0 2px 8px 0 rgba(5,130,202,0.18)' }}
                        onClick={() => setShowRequestScreen(true)}
                     >
                        Servis Talep Et Ekranına Git
                     </Button>
                  </Box>
               );
            }
            // Eğer aktif task yoksa veya butona tıklandıysa, servis talep etme ekranı gösterilecek
            return (
               <Box sx={{ width: '100%', minHeight: '100vh', background: '#0e2235', p: 4 }}>
                  <Snackbar
                     open={showSuccess}
                     autoHideDuration={3000}
                     onClose={() => setShowSuccess(false)}
                     anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  >
                     <MuiAlert elevation={6} variant="filled" severity="success" sx={{ fontSize: 18, fontWeight: 700 }}>
                        {requestSuccess}
                     </MuiAlert>
                  </Snackbar>
                  <Typography variant="h5" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
                     Servis Talep Et
                  </Typography>
                  {servicesLoading ? (
                     <CircularProgress />
                  ) : servicesError ? (
                     <Alert severity="error">{servicesError}</Alert>
                  ) : (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        {availableServices
                           .filter(service => !activeServiceKeys.includes(service.key.toLowerCase()))
                           .map(service => (
                              <Button
                                 key={service.key}
                                 variant={selectedServices.includes(service.key) ? 'contained' : 'outlined'}
                                 onClick={() => handleServiceToggle(service.key)}
                                 sx={{
                                    minWidth: 160,
                                    minHeight: 80,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 3,
                                    borderColor: '#0582CA',
                                    color: '#fff',
                                    background: selectedServices.includes(service.key)
                                       ? 'linear-gradient(90deg, #0582CA, #05CA82)'
                                       : 'rgba(5,130,202,0.18)',
                                    boxShadow: selectedServices.includes(service.key)
                                       ? '0 4px 16px 0 rgba(5,130,202,0.18)'
                                       : '0 2px 8px 0 rgba(5,130,202,0.10)',
                                    borderWidth: 2,
                                    fontWeight: 700,
                                    fontSize: 18,
                                    gap: 1,
                                    opacity: 1,
                                    '&:hover': {
                                       background: 'linear-gradient(90deg, #0582CA, #05CA82)',
                                       color: '#fff',
                                    },
                                 }}
                              >
                                 <img src={LOGO_MAP[service.key] || DEFAULT_LOGO} alt={service.key} style={{ width: 36, height: 36, marginBottom: 6 }} />
                                 {service.key.toUpperCase()}
                              </Button>
                           ))}
                     </Box>
                  )}
                  <Button
                     variant="contained"
                     color="primary"
                     disabled={selectedServices.length === 0 || requesting}
                     onClick={handleRequestServices}
                     sx={{
                        mb: 2,
                        fontWeight: 800,
                        fontSize: 20,
                        borderRadius: 2,
                        px: 5,
                        py: 1.5,
                        minHeight: 48,
                        background: selectedServices.length === 0 ? 'linear-gradient(90deg, #3a7bd5, #00d2ff)' : 'linear-gradient(90deg, #0582CA, #05CA82)',
                        color: '#fff',
                        opacity: 1,
                        boxShadow: '0 4px 16px 0 rgba(5,130,202,0.25)',
                        letterSpacing: 1,
                        textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                        justifyContent: 'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                        '&:hover': {
                           background: 'linear-gradient(90deg, #05CA82, #0582CA)',
                           color: '#fff',
                           boxShadow: '0 8px 32px 0 rgba(5,130,202,0.30)',
                           transform: 'scale(1.04)'
                        },
                        '&:active': {
                           background: 'linear-gradient(90deg, #0582CA, #05CA82)',
                           boxShadow: '0 2px 8px 0 rgba(5,130,202,0.18)',
                           transform: 'scale(0.98)'
                        }
                     }}
                  >
                     TALEP ET
                  </Button>
                  <Button
                     variant="outlined"
                     color="primary"
                     sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        color: '#0582CA',
                        borderColor: '#0582CA',
                        background: 'rgba(5,130,202,0.08)',
                        boxShadow: '0 2px 8px 0 rgba(5,130,202,0.10)',
                        transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
                        '&:hover': {
                           background: 'linear-gradient(90deg, #e0f7fa, #b2ebf2)',
                           color: '#0582CA',
                           boxShadow: '0 4px 16px 0 rgba(5,130,202,0.18)',
                           transform: 'scale(1.03)'
                        },
                        '&:active': {
                           background: 'rgba(5,130,202,0.18)',
                           boxShadow: '0 2px 8px 0 rgba(5,130,202,0.10)',
                           transform: 'scale(0.97)'
                        },
                        alignItems: 'center',
                        display: 'flex',
                        pl: 2
                     }}
                     onClick={() => setShowRequestScreen(false)}
                  >
                     Aktif Servislerim Ekranına Dön
                  </Button>
                  {requestError && <Alert severity="error" sx={{ mt: 2 }}>{requestError}</Alert>}
               </Box>
            );
         })()}

         {/* Admin veya diğer durumlar için ana ekran */}
         {!loading && !error && isAdmin && (
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
                     {(() => {
                        // Sadece benzersiz servis tiplerini göster (çoklamayı engelle) ve sadece Running durumundakileri filtrele
                        const uniqueTasks = [];
                        const seenServiceTypes = new Set();
                        userTasks
                           .filter((task) => task.status === 'Running')  // Sadece Running durumundakileri al
                           .forEach((task) => {
                              const key = task.serviceType?.toLowerCase();
                              if (!seenServiceTypes.has(key)) {
                                 uniqueTasks.push(task);
                                 seenServiceTypes.add(key);
                              }
                           });
                        return uniqueTasks
                           .slice()
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
                                                style={{ width: 48, height: 48, borderRadius: 12, background: '#18304a', objectFit: 'contain', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', cursor: 'pointer' }}
                                                onClick={() => handleLogoClick(task)}
                                             />
                                          </Box>
                                       </Box>
                                       <Chip
                                          label={task.status}
                                          sx={{
                                             background: task.status === 'Running' ? '#2e8b6e' : '#ca8205',
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
                           ))
                     })()}
                  </Grid>
               </Box>
               {/* Modal: Servis sitesini büyük popup olarak göster */}
            </Box>
         )}

         {/* Modal: Her zaman render edilen alan */}
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
      </>
   );
};

export default TasksPage; 