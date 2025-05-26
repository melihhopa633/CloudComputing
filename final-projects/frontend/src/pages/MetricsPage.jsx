import React, { useState, useEffect } from 'react';
import {
   Box,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   CircularProgress,
   Alert,
   Chip,
   IconButton,
   Tooltip,
   TablePagination
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const MetricsPage = () => {
   const [metrics, setMetrics] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const fetchMetrics = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await axios.get('http://localhost:4002/api/metrics?all=true&limit=100&sortBy=id&sortOrder=ASC');
         if (response.data.metrics) {
            setMetrics(response.data.metrics);
         } else {
            setError('Failed to fetch metrics');
         }
      } catch (err) {
         setError('Failed to connect to the server');
         console.error('Error fetching metrics:', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchMetrics();
   }, []);

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
   };

   const getMemoryColor = (memoryMB) => {
      const memory = parseFloat(memoryMB);
      if (memory > 200) return 'error';
      if (memory > 100) return 'warning';
      return 'success';
   };

   const getCpuColor = (cpuUsage) => {
      const cpu = parseFloat(cpuUsage);
      if (cpu > 0.5) return 'error';
      if (cpu > 0.2) return 'warning';
      return 'success';
   };

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (error) {
      return (
         <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
               {error}
            </Alert>
            <IconButton onClick={fetchMetrics} color="primary">
               <RefreshIcon />
            </IconButton>
         </Box>
      );
   }

   const paginatedMetrics = metrics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

   return (
      <Box sx={{ p: 3, bgcolor: '#001427', minHeight: '100vh' }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{
               fontWeight: 700,
               background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               textShadow: '0 0 20px rgba(0, 102, 255, 0.3)',
            }}>
               System Metrics
            </Typography>
            <Tooltip title="Refresh Metrics">
               <IconButton 
                  onClick={fetchMetrics} 
                  sx={{ 
                     color: '#0066FF',
                     '&:hover': { backgroundColor: 'rgba(0, 102, 255, 0.1)' }
                  }}
               >
                  <RefreshIcon />
               </IconButton>
            </Tooltip>
         </Box>

         <TableContainer component={Paper} sx={{ 
            bgcolor: 'rgba(0, 20, 40, 0.8)', 
            borderRadius: 2,
            border: '1px solid rgba(0, 102, 255, 0.2)'
         }}>
            <Table>
               <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0, 102, 255, 0.1)' }}>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>ID</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>User Email</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>User Full Name</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Container ID</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Container Name</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Memory (MB)</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>CPU Usage</TableCell>
                     <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Created At</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {paginatedMetrics.map((metric) => (
                     <TableRow 
                        key={metric.id} 
                        sx={{ 
                           '&:hover': { bgcolor: 'rgba(0, 102, 255, 0.05)' },
                           borderBottom: '1px solid rgba(0, 102, 255, 0.1)'
                        }}
                     >
                        <TableCell sx={{ color: '#e3f2fd', fontSize: '0.875rem' }}>
                           {metric.id || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: '#e3f2fd' }}>
                           {metric.user_email || metric.userEmail || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: '#e3f2fd', fontWeight: 600 }}>
                           {metric.user_fullname || metric.userFullname || 'N/A'}
                        </TableCell>
                        <TableCell sx={{ color: '#e3f2fd', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                           {metric.container_id?.substring(0, 12) || metric.containerId?.substring(0, 12) || 'N/A'}...
                        </TableCell>
                        <TableCell sx={{ color: '#e3f2fd', fontWeight: 500 }}>
                           {metric.container_name || metric.containerName || 'N/A'}
                        </TableCell>
                        <TableCell>
                           <Chip
                              label={`${metric.memory_mb || metric.memoryMB || 0} MB`}
                              color={getMemoryColor(metric.memory_mb || metric.memoryMB)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                           />
                        </TableCell>
                        <TableCell>
                           <Chip
                              label={`${(parseFloat(metric.cpu_usage || metric.cpuUsage || 0) * 100).toFixed(2)}%`}
                              color={getCpuColor(metric.cpu_usage || metric.cpuUsage)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                           />
                        </TableCell>
                        <TableCell sx={{ color: '#e3f2fd', fontSize: '0.875rem' }}>
                           {formatDate(metric.created_at || metric.createdAt)}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         <TablePagination
            component="div"
            count={metrics.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
               color: '#fff',
               '& .MuiTablePagination-selectIcon': { color: '#fff' },
               '& .MuiTablePagination-select': { color: '#fff' },
               '& .MuiTablePagination-displayedRows': { color: '#fff' }
            }}
         />
      </Box>
   );
};

export default MetricsPage; 