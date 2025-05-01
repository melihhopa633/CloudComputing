import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';

const UserDialog = ({
    open,
    onClose,
    title,
    user,
    onChange,
    onSubmit,
    isEdit = false,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    background: 'rgba(0, 20, 40, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 102, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                textShadow: '0 0 20px rgba(0, 102, 255, 0.3)',
            }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    value={user.username}
                    onChange={(e) => onChange('username', e.target.value)}
                    sx={{
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                                borderColor: 'rgba(0, 102, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(0, 102, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0066FF',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                        },
                    }}
                />
                <TextField
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    value={user.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                                borderColor: 'rgba(0, 102, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(0, 102, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0066FF',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                        },
                    }}
                />
                {!isEdit && (
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={user.password}
                        onChange={(e) => onChange('password', e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': {
                                    borderColor: 'rgba(0, 102, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(0, 102, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#0066FF',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                            },
                        }}
                    />
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(45deg, #0066FF, #00B4FF)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #0055DD, #0099FF)',
                            boxShadow: '0 0 20px rgba(0, 102, 255, 0.4)',
                        },
                        boxShadow: '0 0 15px rgba(0, 102, 255, 0.3)',
                    }}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog; 