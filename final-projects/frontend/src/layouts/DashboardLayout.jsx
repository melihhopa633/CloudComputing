import React, { useState, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  PeopleAlt as PeopleIcon,
  VpnKey as RoleIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Monitor as LogViewerIcon,
  MonitorHeart as PrometheusIcon,
  Analytics as MetricsIcon,
  AttachMoney as BillingIcon,
} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import authService from '../services/authService';

const drawerWidth = 240;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    // Check if user is admin when component mounts
    setIsAdmin(authService.isAdmin());
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    ...(isAdmin ? [
      { text: '🏠 Dashboard', icon: <DashboardIcon />, path: '/' },
      {
        text: '👥 User Management',
        icon: <PeopleIcon />,
        hasSubMenu: true,
        subItems: [
          { text: 'Users', icon: <PeopleIcon />, path: '/users' },
          { text: 'Roles', icon: <RoleIcon />, path: '/roles' },
          { text: 'User Roles', icon: <AssignmentIcon />, path: '/roles/user-roles' }
        ]
      },
      { text: '📊 Tasks', icon: <TaskIcon />, path: '/tasks' },
      { text: '📈 Metrics', icon: <MetricsIcon />, path: '/metrics' },
      { text: '💰 Billing & Invoices', icon: <BillingIcon />, path: '/billing' },
      { text: '📝 Log Viewer', icon: <LogViewerIcon />, path: '/log-viewer' },
      { text: '🔥 Prometheus', icon: <PrometheusIcon />, path: '/prometheus' }
    ] : [
      { text: '🏠 Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: '📊 Tasks', icon: <TaskIcon />, path: '/tasks' },
      { text: '💰 Billing & Invoices', icon: <BillingIcon />, path: '/billing' }
    ]),
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    setAnchorEl(null);
    navigate('/login');
  };

  // Get username from localStorage
  const username = localStorage.getItem('username') || 'User';

  const drawer = (
    <div>
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
            {item.hasSubMenu && item.text === 'User Management' && openUserManagement && (
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
                        bgcolor: location.pathname === subItem.path ? 'rgba(0, 102, 255, 0.2)' : 'transparent',
                      }}
                    >
                      <ListItemIcon sx={{ color: '#0066FF' }}>{subItem.icon}</ListItemIcon>
                      <ListItemText primary={subItem.text} sx={{ color: '#fff' }} />
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
          bgcolor: '#003366',
          boxShadow: '0 4px 24px 0 rgba(0, 102, 255, 0.10)',
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', minHeight: 72 }}>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 2, p: 0 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00BFFF 0%, #0066FF 100%)',
                boxShadow: '0 2px 12px 0 rgba(0, 102, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 24px 0 rgba(0, 102, 255, 0.25)',
                },
              }}
            >
              <AccountCircle fontSize="large" sx={{ color: '#fff' }} />
            </Box>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(0, 102, 255, 0.15)',
                bgcolor: 'rgba(10, 25, 47, 0.98)',
                p: 1,
                border: '1.5px solid #0066FF',
              }
            }}
            MenuListProps={{
              disablePadding: true,
              autoFocusItem: false,
            }}
          >
            <MenuItem disabled sx={{
              fontWeight: 700,
              color: '#b3c6e0',
              fontSize: '1.08rem',
              mb: 1,
              borderRadius: 2,
              background: 'rgba(0, 20, 40, 0.7)',
              opacity: 1,
            }}>
              {username}
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                background: 'none',
                boxShadow: 'none',
                px: 2,
                py: 1.2,
                mt: 0.5,
                '&:hover': {
                  background: 'linear-gradient(90deg, #00BFFF 0%, #0066FF 100%)',
                  color: '#fff',
                },
                transition: 'all 0.2s',
              }}
            >
              Log out
            </MenuItem>
          </Menu>
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
