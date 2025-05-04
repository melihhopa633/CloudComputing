import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useLocation } from 'react-router-dom';
import LogViewerSidebar from './LogViewerSidebar';
import MonitorIcon from '@mui/icons-material/Monitor';

const Sidebar = () => {
  const [openRoles, setOpenRoles] = useState(false);
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    {
      text: 'Roles',
      icon: <VpnKeyIcon />,
      isDropdown: true,
      subItems: [
        { text: 'User Roles', icon: <AssignmentIcon />, path: '/roles/user-roles' }
      ]
    },
    { text: 'Log Viewer', icon: <MonitorIcon />, path: '/log-viewer' },


  ];

  const handleClick = (item) => {
    if (item.isDropdown) {
      setOpenRoles(!openRoles);
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
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" component="h1">
          Admin Dashboard
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
                  item.isDropdown && location.pathname.includes('/roles') ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.isDropdown && (openRoles ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.isDropdown && (
              <Collapse in={openRoles} timeout="auto" unmountOnExit>
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
      {/* SEQ Logları Göster butonu ve iframe alanı */}
      <Box sx={{ px: 2, mt: 2 }}>
        <LogViewerSidebar />
      </Box>
    </Box>
  );
};

export default Sidebar;
