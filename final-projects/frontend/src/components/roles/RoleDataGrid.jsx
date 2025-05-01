import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const RoleDataGrid = ({ roles, loading, onEdit, onDelete }) => {
    const columns = [
        {
            field: 'roleName',
            headerName: 'Role Name',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{
                    fontWeight: 500,
                    color: '#0066FF',
                    textShadow: '0 0 10px rgba(0, 102, 255, 0.3)',
                }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'userRoles',
            headerName: 'Assigned Users',
            width: 300,
            renderCell: (params) => (
                <Typography variant="body2" sx={{
                    color: '#00B4FF',
                    textShadow: '0 0 10px rgba(0, 180, 255, 0.3)',
                }}>
                    {params.value.length} users
                </Typography>
            )
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{
                    color: '#0099FF',
                    fontWeight: 500,
                    textShadow: '0 0 10px rgba(0, 153, 255, 0.3)',
                }}>
                    {new Date(params.value).toLocaleDateString()}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit role">
                        <IconButton
                            size="small"
                            onClick={() => onEdit(params.row)}
                            sx={{
                                color: '#0066FF',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                                    transform: 'scale(1.2)',
                                    transition: 'all 0.3s ease',
                                },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete role">
                        <IconButton
                            size="small"
                            onClick={() => onDelete(params.row.id)}
                            sx={{
                                color: '#FF3366',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 51, 102, 0.1)',
                                    transform: 'scale(1.2)',
                                    transition: 'all 0.3s ease',
                                },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <DataGrid
            rows={roles}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            sx={{
                border: 'none',
                background: 'rgba(0, 20, 40, 0.7)',
                backdropFilter: 'blur(10px)',
                '& .MuiDataGrid-main': {
                    backgroundColor: 'transparent',
                },
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent !important',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 102, 255, 0.1) !important',
                        transform: 'scale(1.02)',
                    },
                },
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#001427',
                    borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
                    color: '#0066FF',
                    fontWeight: 700,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    color: '#0066FF',
                    fontWeight: 700,
                },
                '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#001427',
                    '&:hover': {
                        backgroundColor: '#001f3d',
                    },
                    '&:focus': {
                        backgroundColor: '#001427',
                    },
                },
                '& .MuiDataGrid-row': {
                    backgroundColor: 'rgba(0, 20, 40, 0.5) !important',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 102, 255, 0.1) !important',
                        transform: 'scale(1.01)',
                    },
                },
                '& .MuiDataGrid-footerContainer': {
                    backgroundColor: 'rgba(0, 20, 40, 0.9)',
                    borderTop: '1px solid rgba(0, 102, 255, 0.2)',
                },
                '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: 'transparent',
                },
                '& .MuiCheckbox-root': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-columnSeparator': {
                    color: 'rgba(0, 102, 255, 0.2)',
                },
                '& .MuiDataGrid-menuIcon': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-sortIcon': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-iconButtonContainer': {
                    backgroundColor: 'transparent',
                },
                '& .MuiDataGrid-iconSeparator': {
                    color: 'rgba(0, 102, 255, 0.2)',
                }
            }}
        />
    );
};

export default RoleDataGrid; 