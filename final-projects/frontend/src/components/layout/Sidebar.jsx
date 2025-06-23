import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon, Security as SecurityIcon, Assignment as AssignmentIcon, Computer as MonitorIcon, Receipt as ReceiptIcon, Analytics as MetricsIcon, AttachMoney as BillingIcon } from '@mui/icons-material';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: '🏠 Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: '👥 Users', icon: <PeopleIcon />, path: '/users' },
        { text: '🔐 Roles', icon: <SecurityIcon />, path: '/roles' },
        { text: '👤 User Roles', icon: <AssignmentIcon />, path: '/user-roles' },
        { text: '📊 Tasks', icon: <AssignmentIcon />, path: '/tasks' },
        { text: '📈 Metrics', icon: <MetricsIcon />, path: '/metrics' },
        { text: '💰 Billing & Invoices', icon: <BillingIcon />, path: '/billing' },
        { text: '📝 Log Viewer', icon: <MonitorIcon />, path: '/log-viewer' },
    ];


    return (
        <Box sx={{
            width: 280,
            height: '100vh',
            background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            borderRight: '2px solid rgba(101, 31, 255, 0.2)',
            boxShadow: '0 0 30px rgba(101, 31, 255, 0.3)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(101, 31, 255, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none',
            }
        }}>
            <Box sx={{
                p: 3,
                borderBottom: '2px solid rgba(101, 31, 255, 0.3)',
                background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
            }}>
                <Typography variant="h5" sx={{
                    color: 'transparent',
                    fontWeight: 800,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #651fff 0%, #10b981 50%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '1px',
                    textShadow: '0 0 30px rgba(101, 31, 255, 0.5)',
                    mb: 1,
                }}>
                    ⚡ DecentraCloud
                </Typography>
                <Typography variant="caption" sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'block',
                    textAlign: 'center',
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                }}>
                    Admin Dashboard
                </Typography>
            </Box>
            <List sx={{ p: 2, position: 'relative', zIndex: 1 }}>
                {menuItems.map((item, index) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: '12px',
                                mb: 0.5,
                                color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                                background: location.pathname === item.path
                                    ? 'linear-gradient(135deg, rgba(101, 31, 255, 0.8) 0%, rgba(16, 185, 129, 0.6) 100%)'
                                    : 'transparent',
                                backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                                boxShadow: location.pathname === item.path
                                    ? '0 8px 32px rgba(101, 31, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                    : 'none',
                                border: location.pathname === item.path
                                    ? '1px solid rgba(101, 31, 255, 0.3)'
                                    : '1px solid transparent',
                                '&:hover': {
                                    background: location.pathname === item.path
                                        ? 'linear-gradient(135deg, rgba(101, 31, 255, 0.9) 0%, rgba(16, 185, 129, 0.7) 100%)'
                                        : 'rgba(101, 31, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: location.pathname === item.path
                                        ? '0 12px 40px rgba(101, 31, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                        : '0 8px 25px rgba(101, 31, 255, 0.3)',
                                    '& .MuiListItemIcon-root': {
                                        color: '#fff',
                                        transform: 'scale(1.1)',
                                    },
                                    '& .MuiTypography-root': {
                                        color: '#fff',
                                    }
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                py: 1.5,
                                px: 2,
                            }}
                        >
                            <ListItemIcon sx={{
                                color: location.pathname === item.path ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                                transition: 'all 0.3s ease',
                                minWidth: '40px',
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: location.pathname === item.path ? 700 : 500,
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s ease',
                                        letterSpacing: '0.5px',
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