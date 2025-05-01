import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FolderIcon from '@mui/icons-material/Folder';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Roles', icon: <VpnKeyIcon />, path: '/roles' },
    { text: 'Files', icon: <FolderIcon />, path: '/files' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        minHeight: '100vh',
        bgcolor: '#001427',
        color: 'white',
        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h1">
          Admin Dashboard
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
              py: 1.5,
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
