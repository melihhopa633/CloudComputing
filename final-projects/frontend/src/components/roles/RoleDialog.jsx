import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';

const RoleDialog = ({
    open,
    onClose,
    title,
    role,
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
                <TextField
                    autoFocus
                    margin="dense"
                    label="Role Name"
                    type="text"
                    fullWidth
                    value={role.roleName}
                    onChange={(e) => onChange('roleName', e.target.value)}
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
            </DialogContent>
            <DialogActions sx={{
                padding: '16px 24px',
                gap: '12px',
            }}>
                <Button
                    onClick={onClose}
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
                    onClick={onSubmit}
                    variant="contained"
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
                    }}
                >
                    {isEdit ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleDialog; 