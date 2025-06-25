import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonitorIcon from '@mui/icons-material/Monitor';
import TaskIcon from '@mui/icons-material/Task';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = () => {
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is admin when component mounts
    setIsAdmin(authService.isAdmin());
  }, []);

  // Admin can see all menus
  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      isDropdown: true,
      subItems: [
        { text: 'Users', icon: <PeopleIcon />, path: '/users' },
        { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
        { text: 'User Roles', icon: <AssignmentIcon />, path: '/user-roles' }
      ]
    },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Metrics', icon: <AnalyticsIcon />, path: '/metrics' },
    { text: 'Billing & Invoices', icon: <AttachMoneyIcon />, path: '/billing' },
    { text: 'Log Viewer', icon: <MonitorIcon />, path: '/log-viewer' },
    { text: 'Prometheus', icon: <TimelineIcon />, path: '/prometheus' },
  ];

  // Normal users can only see limited menus
  const userMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
  ];

  // Choose menu items based on user role
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleClick = (item) => {
    if (item.isDropdown && item.text === 'User Management') {
      setOpenUserManagement(!openUserManagement);
    }
  };

  return (
    <Box
      sx={{
        width: 240,
        minHeight: '100vh',
        bgcolor: '#001427',
        color: 'white',
        borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h1">
          {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem
              button
              component={item.isDropdown ? 'div' : Link}
              to={!item.isDropdown ? item.path : undefined}
              onClick={() => handleClick(item)}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
                py: 1.5,
                bgcolor: !item.isDropdown && location.pathname === item.path ? 'rgba(255, 255, 255, 0.12)' :
                  item.isDropdown && (location.pathname.includes('/users') || location.pathname.includes('/roles')) ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.isDropdown && item.text === 'User Management' && (openUserManagement ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.isDropdown && item.text === 'User Management' && (
              <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      component={Link}
                      to={subItem.path}
                      key={subItem.text}
                      sx={{
                        pl: 4,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                        },
                        py: 1.5,
                        bgcolor: location.pathname === subItem.path ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
