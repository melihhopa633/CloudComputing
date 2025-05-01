import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Autocomplete,
} from '@mui/material';
import userService from '../../services/userService';
import roleService from '../../services/roleService';

const UserRoleDialog = ({
    open,
    onClose,
    title,
    onSubmit,
}) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, rolesResponse] = await Promise.all([
                    userService.getAll(),
                    roleService.getAll()
                ]);
                setUsers(usersResponse.data);
                setRoles(rolesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        if (open) {
            fetchData();
        }
    }, [open]);

    const handleSubmit = () => {
        if (selectedUser && selectedRole) {
            onSubmit({
                userId: selectedUser.id,
                roleId: selectedRole.id
            });
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedUser(null);
        setSelectedRole(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    background: 'rgba(0, 20, 40, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                    minWidth: '400px',
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '1.5rem',
                textShadow: '0 0 20px rgba(0, 102, 255, 0.5)',
                padding: '20px 24px',
            }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ padding: '20px 24px' }}>
                <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option.username}
                    value={selectedUser}
                    onChange={(event, newValue) => setSelectedUser(newValue)}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select User"
                            margin="dense"
                            fullWidth
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    fontSize: '1.1rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 102, 255, 0.5)',
                                        borderWidth: '2px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 102, 255, 0.8)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#0066FF',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '1.1rem',
                                    '&.Mui-focused': {
                                        color: '#0066FF',
                                    },
                                },
                            }}
                        />
                    )}
                />
                <Autocomplete
                    options={roles}
                    getOptionLabel={(option) => option.roleName}
                    value={selectedRole}
                    onChange={(event, newValue) => setSelectedRole(newValue)}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Role"
                            margin="dense"
                            fullWidth
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    fontSize: '1.1rem',
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 102, 255, 0.5)',
                                        borderWidth: '2px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 102, 255, 0.8)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#0066FF',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '1.1rem',
                                    '&.Mui-focused': {
                                        color: '#0066FF',
                                    },
                                },
                            }}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions sx={{
                padding: '16px 24px',
                gap: '12px',
            }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        padding: '8px 20px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!selectedUser || !selectedRole}
                    sx={{
                        background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        padding: '8px 20px',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #0055DD, #0099FF)',
                            boxShadow: '0 0 20px rgba(0, 102, 255, 0.6)',
                        },
                        boxShadow: '0 0 15px rgba(0, 102, 255, 0.4)',
                        '&.Mui-disabled': {
                            background: 'rgba(0, 102, 255, 0.3)',
                            color: 'rgba(255, 255, 255, 0.5)',
                        },
                    }}
                >
                    Assign Role
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserRoleDialog; 