import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, Security as SecurityIcon, Assignment as AssignmentIcon, Computer as MonitorIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Users', icon: <PeopleIcon />, path: '/users' },
        { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
        { text: 'User Roles', icon: <AssignmentIcon />, path: '/user-roles' },
        { text: 'Billing', icon: <ReceiptIcon />, path: '/billing' },
        { text: 'Log Viewer', icon: <MonitorIcon />, path: '/log-viewer' },
    ];


    return (
        <Box sx={{
            width: 240,
            height: '100vh',
            background: 'linear-gradient(135deg, #001427 0%, #000B1A 100%)',
            borderRight: '1px solid rgba(0, 102, 255, 0.1)',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 102, 255, 0.1)' }}>
                <Typography variant="h6" sx={{
                    color: '#fff',
                    fontWeight: 700,
                    textAlign: 'center',
                    background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(0, 102, 255, 0.3)',
                }}>
                    Admin Panel
                </Typography>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: location.pathname === item.path ? '#0066FF' : '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                                    '& .MuiListItemIcon-root': {
                                        color: '#0066FF',
                                    },
                                },
                                borderLeft: location.pathname === item.path ? '4px solid #0066FF' : 'none',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <ListItemIcon sx={{
                                color: location.pathname === item.path ? '#0066FF' : '#fff',
                                transition: 'color 0.3s ease',
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                        transition: 'font-weight 0.3s ease',
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar; 