import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { keyframes } from '@mui/system';
import userRoleService from '../services/userRoleService';
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UserRoleHeader from '../components/userRoles/UserRoleHeader';
import UserRoleDialog from '../components/userRoles/UserRoleDialog';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'N/A';
    }
};

const UserRolesPage = () => {
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const columns = [
        {
            field: 'username',
            headerName: 'User Name',
            flex: 1,
            headerClassName: 'super-app-theme--header'
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            headerClassName: 'super-app-theme--header'
        },
        {
            field: 'roleName',
            headerName: 'Role',
            flex: 1,
            headerClassName: 'super-app-theme--header'
        },

        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.5,
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleDeleteUserRole(params.id)}
                    color="error"
                    size="small"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    useEffect(() => {
        fetchUserRoles();
    }, []);

    const showSuccessAlert = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonColor: '#0066FF',
            background: 'rgba(0, 20, 40, 0.95)',
            color: '#fff',
            backdrop: 'rgba(0, 0, 0, 0.7)',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    };

    const showErrorAlert = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonColor: '#0066FF',
            background: 'rgba(0, 20, 40, 0.95)',
            color: '#fff',
            backdrop: 'rgba(0, 0, 0, 0.7)'
        });
    };

    const fetchUserRoles = async () => {
        try {
            setLoading(true);
            const response = await userRoleService.getAll();
            if (response.success && Array.isArray(response.data)) {
                const formattedData = response.data.map(item => ({
                    id: item.id,
                    username: item.user?.username || 'N/A',
                    email: item.user?.email || 'N/A',
                    roleName: item.role?.roleName || 'N/A',
                    user: {
                        ...item.user,
                        createdAt: item.user?.createdAt ? new Date(item.user.createdAt) : null
                    },
                    userId: item.userId,
                    roleId: item.roleId
                }));
                setUserRoles(formattedData);
            } else {
                throw new Error('Invalid data format received');
            }
            setError(null);
        } catch (err) {
            setError(err.message);
            showErrorAlert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUserRole = async (id) => {
        if (!id) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0066FF',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            background: 'rgba(0, 20, 40, 0.95)',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await userRoleService.delete(id);
                    await fetchUserRoles();
                    showSuccessAlert('Success', 'User role has been removed');
                } catch (err) {
                    showErrorAlert('Error', err.message);
                }
            }
        });
    };

    return (
        <Box sx={{
            p: 3,
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #001427 0%, #000B1A 100%)',
        }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(0, 20, 40, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 102, 255, 0.1)',
                    animation: `${fadeIn} 0.5s ease-out`,
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                }}
            >


                <UserRoleHeader onRefresh={fetchUserRoles} onAddUserRole={() => setOpenDialog(true)} />

                <Box sx={{ height: 400, width: '100%', mt: 3 }}>
                    <DataGrid
                        rows={userRoles}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        disableSelectionOnClick
                        loading={loading}
                        sx={{
                            border: 'none',
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiDataGrid-cell': {
                                color: '#fff',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                            },
                            '& .super-app-theme--header': {
                                backgroundColor: '#001427',
                                color: '#0066FF',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                borderBottom: '2px solid rgba(0, 102, 255, 0.2)'
                            },
                            '& .MuiDataGrid-row': {
                                backgroundColor: 'rgba(0, 20, 40, 0.5) !important',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 102, 255, 0.15) !important',
                                    color: '#fff',
                                },
                            },
                            '& .MuiDataGrid-footerContainer': {
                                bgcolor: 'rgba(0, 102, 255, 0.1)',
                                color: '#fff',
                                borderTop: 'none'
                            },
                            '& .MuiTablePagination-root': {
                                color: '#fff'
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                                width: '0.4em',
                                height: '0.4em'
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                                background: 'rgba(0, 0, 0, 0.1)'
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0, 102, 255, 0.4)',
                                borderRadius: '6px'
                            },
                            '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
                                background: 'rgba(0, 102, 255, 0.6)'
                            }
                        }}
                    />
                </Box>
            </Paper>

            <UserRoleDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Assign User Role"
                onSubmit={async (data) => {
                    try {
                        await userRoleService.create(data);
                        await fetchUserRoles();
                        setOpenDialog(false);
                        showSuccessAlert('Success', 'User role assigned successfully');
                    } catch (err) {
                        showErrorAlert('Error', err.message);
                    }
                }}
            />
        </Box>
    );
};

export default UserRolesPage; 