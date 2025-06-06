import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const UserRoleDataGrid = ({ userRoles, loading, onDelete }) => {
    const columns = [
        {
            field: 'username',
            headerName: 'Username',
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
            field: 'roleName',
            headerName: 'Role',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{
                    color: '#00B4FF',
                    textShadow: '0 0 10px rgba(0, 180, 255, 0.3)',
                }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            flex: 0.5,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Remove role">
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
            rows={userRoles}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            sx={{
                border: 'none',
                background: 'rgba(0, 20, 40, 0.7)',
                backdropFilter: 'blur(10px)',
                width: '100%',
                '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 102, 255, 0.1)',
                        transform: 'scale(1.02)',
                    },
                },
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'rgba(0, 20, 40, 0.9)',
                    borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
                    color: '#0066FF',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    },
                },
                '& .MuiDataGrid-row': {
                    backgroundColor: 'rgba(0, 20, 40, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 102, 255, 0.1)',
                        transform: 'scale(1.01)',
                    },
                },
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus-within': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700,
                },
                '& .MuiTablePagination-root': {
                    color: '#0066FF',
                },
                '& .MuiIconButton-root': {
                    color: '#0066FF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.2)',
                        color: '#00B4FF',
                    },
                },
                '& .MuiDataGrid-menuIcon': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-sortIcon': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-checkboxInput': {
                    color: '#0066FF',
                },
                '& .MuiDataGrid-virtualScroller': {
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 20, 40, 0.5)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 102, 255, 0.5)',
                        borderRadius: '4px',
                        '&:hover': {
                            background: 'rgba(0, 102, 255, 0.7)',
                        },
                    },
                },
            }}
        />
    );
};

export default UserRoleDataGrid; 