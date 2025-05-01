import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse, useTheme } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  PeopleAlt as PeopleIcon,
  VpnKey as RoleIcon,
  CloudUpload as FileIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

const DashboardLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      hasSubMenu: true,
      subItems: [
        { text: 'Users', icon: <PeopleIcon />, path: '/users' },
        { text: 'Roles', icon: <RoleIcon />, path: '/roles' },
        { text: 'User Roles', icon: <AssignmentIcon />, path: '/roles/user-roles' }
      ]
    },
    { text: 'Files', icon: <FileIcon />, path: '/files' },
  ];

  const handleMenuItemClick = (item) => {
    if (item.hasSubMenu) {
      if (item.text === 'User Management') {
        setOpenUserManagement(!openUserManagement);
      }
    } else {
      navigate(item.path);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem
              onClick={() => handleMenuItemClick(item)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 102, 255, 0.1)',
                  cursor: 'pointer'
                },
                bgcolor: location.pathname === item.path ||
                  (item.text === 'User Management' &&
                    (location.pathname.includes('/users') ||
                      location.pathname.includes('/roles'))) ?
                  'rgba(0, 102, 255, 0.2)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: '#0066FF' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ color: '#fff' }}
              />
              {item.hasSubMenu && (
                item.text === 'User Management' ?
                  (openUserManagement ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />) :
                  null
              )}
            </ListItem>

            {item.hasSubMenu && item.text === 'User Management' && (
              <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      key={subItem.text}
                      onClick={() => navigate(subItem.path)}
                      sx={{
                        pl: 4,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 102, 255, 0.1)',
                          cursor: 'pointer'
                        },
                        bgcolor: location.pathname === subItem.path ?
                          'rgba(0, 102, 255, 0.2)' : 'transparent',
                      }}
                    >
                      <ListItemIcon sx={{ color: '#0066FF' }}>{subItem.icon}</ListItemIcon>
                      <ListItemText
                        primary={subItem.text}
                        sx={{ color: '#fff' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#001427', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#0066FF'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#001427',
              borderRight: '1px solid rgba(0, 102, 255, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#001427',
              borderRight: '1px solid rgba(0, 102, 255, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
