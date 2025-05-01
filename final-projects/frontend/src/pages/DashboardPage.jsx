import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#001427',
      color: 'white',
      p: 3
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          color: 'white',
          mb: 4,
          fontWeight: 'normal'
        }}
      >
        Admin Dashboard
      </Typography>
    </Box>
  );
};

export default DashboardPage;
