import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';

const RolesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
  });

  // Dummy data for demonstration
  const rows = [
    { 
      id: 1, 
      name: 'Admin', 
      description: 'Full system access', 
      users: ['john_doe', 'admin_user'],
      createdAt: '2025-05-01' 
    },
    { 
      id: 2, 
      name: 'User', 
      description: 'Regular user access', 
      users: ['jane_smith'],
      createdAt: '2025-05-01' 
    },
    { 
      id: 3, 
      name: 'Moderator', 
      description: 'Content management access', 
      users: [],
      createdAt: '2025-05-01' 
    },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Role Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    {
      field: 'users',
      headerName: 'Assigned Users',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {params.value.map((user) => (
            <Chip key={user} label={user} size="small" />
          ))}
        </Box>
      ),
    },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRole({ name: '', description: '' });
  };

  const handleCreateRole = () => {
    // TODO: Implement role creation
    console.log('Creating role:', newRole);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Role Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Role
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            type="text"
            fullWidth
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;
