import React from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const RoleHeader = ({ onRefresh, onAddRole }) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            pb: 2,
            borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
        }}>
            <Typography variant="h4" sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(0, 102, 255, 0.3)',
            }}>
                Role Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh roles">
                    <IconButton
                        onClick={onRefresh}
                        sx={{
                            color: '#0066FF',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                                transform: 'rotate(180deg)',
                                transition: 'transform 0.5s ease',
                            },
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAddRole}
                    sx={{
                        background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #0055DD, #0099FF)',
                            boxShadow: '0 0 20px rgba(0, 102, 255, 0.4)',
                        },
                        boxShadow: '0 0 15px rgba(0, 102, 255, 0.3)',
                    }}
                >
                    Add Role
                </Button>
            </Box>
        </Box>
    );
};

export default RoleHeader; 