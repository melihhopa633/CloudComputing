import React, { useState, useEffect, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import userService from '../services/userService';
import Swal from 'sweetalert2';
import UserHeader from '../components/users/UserHeader';
import UserDataGrid from '../components/users/UserDataGrid';
import UserDialog from '../components/users/UserDialog';

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

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [editUser, setEditUser] = useState({
    username: '',
    email: '',
  });

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
      customClass: {
        title: 'swal2-title',
        content: 'swal2-content',
        confirmButton: 'swal2-confirm',
      },
      buttonsStyling: false,
      confirmButtonText: 'OK',
      width: '400px',
      padding: '2rem',
      titleText: title,
      html: `<div style="font-size: 1.1rem; margin-top: 1rem;">${message}</div>`,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      confirmButtonText: 'OK',
      html: `
        <div style="font-size: 1.1rem; margin-top: 1rem;">${message}</div>
        <style>
          .swal2-confirm-button {
            background: linear-gradient(45deg, #0066FF, #00B4FF) !important;
            border: none !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: 4px !important;
            box-shadow: 0 0 15px rgba(0, 102, 255, 0.4) !important;
            transition: all 0.3s ease !important;
          }
          .swal2-confirm-button:hover {
            background: linear-gradient(45deg, #0055DD, #0099FF) !important;
            box-shadow: 0 0 20px rgba(0, 102, 255, 0.6) !important;
            transform: translateY(-2px) !important;
          }
        </style>
      `,
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
      backdrop: 'rgba(0, 0, 0, 0.7)',
      customClass: {
        title: 'swal2-title',
        content: 'swal2-content',
        confirmButton: 'swal2-confirm',
      },
      buttonsStyling: false,
      confirmButtonText: 'OK',
      width: '400px',
      padding: '2rem',
      titleText: title,
      html: `
        <div style="font-size: 1.1rem; margin-top: 1rem;">${message}</div>
        <style>
          .swal2-confirm-button {
            background: linear-gradient(45deg, #0066FF, #00B4FF) !important;
            border: none !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: 4px !important;
            box-shadow: 0 0 15px rgba(0, 102, 255, 0.4) !important;
            transition: all 0.3s ease !important;
          }
          .swal2-confirm-button:hover {
            background: linear-gradient(45deg, #0055DD, #0099FF) !important;
            box-shadow: 0 0 20px rgba(0, 102, 255, 0.6) !important;
            transform: translateY(-2px) !important;
          }
        </style>
      `,
    });
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt).toLocaleDateString()
      })));
    } catch (err) {
      showErrorAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ username: '', email: '', password: '' });
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setEditUser({
      username: user.username,
      email: user.email,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
    setEditUser({ username: '', email: '' });
  };

  const handleCreateUser = async () => {
    try {
      await userService.create(newUser);
      await fetchUsers();
      handleCloseDialog();
      showSuccessAlert('Success', 'User created successfully');
    } catch (err) {
      showErrorAlert('Error', err.message);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = {
        id: selectedUser.id,
        username: editUser.username,
        email: editUser.email
      };
      await userService.update(selectedUser.id, updateData);
      await fetchUsers();
      handleCloseEditDialog();
      showSuccessAlert('Success', 'User updated successfully');
    } catch (err) {
      showErrorAlert('Error', err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0066FF',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: 'rgba(0, 20, 40, 0.95)',
      color: '#fff',
      backdrop: 'rgba(0, 0, 0, 0.7)',
      customClass: {
        title: 'swal2-title',
        content: 'swal2-content',
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button',
      },
      buttonsStyling: false,
      width: '400px',
      padding: '2rem',
      titleText: 'Are you sure?',
      html: `
        <div style="font-size: 1.1rem; margin-top: 1rem;">You won't be able to revert this!</div>
        <style>
          .swal2-confirm-button {
            background: linear-gradient(45deg, #0066FF, #00B4FF) !important;
            border: none !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: 4px !important;
            box-shadow: 0 0 15px rgba(0, 102, 255, 0.4) !important;
            transition: all 0.3s ease !important;
            margin-right: 10px !important;
          }
          .swal2-confirm-button:hover {
            background: linear-gradient(45deg, #0055DD, #0099FF) !important;
            box-shadow: 0 0 20px rgba(0, 102, 255, 0.6) !important;
            transform: translateY(-2px) !important;
          }
          .swal2-cancel-button {
            background: linear-gradient(45deg, #FF3366, #FF6B6B) !important;
            border: none !important;
            color: white !important;
            padding: 10px 30px !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: 4px !important;
            box-shadow: 0 0 15px rgba(255, 51, 102, 0.4) !important;
            transition: all 0.3s ease !important;
          }
          .swal2-cancel-button:hover {
            background: linear-gradient(45deg, #FF1A4D, #FF5252) !important;
            box-shadow: 0 0 20px rgba(255, 51, 102, 0.6) !important;
            transform: translateY(-2px) !important;
          }
        </style>
      `,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await userService.delete(id);
          await fetchUsers();
          showSuccessAlert('Deleted!', 'User has been deleted.');
        } catch (err) {
          showErrorAlert('Error', err.message);
        }
      }
    });
  };

  const handleUserChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditUser(prev => ({ ...prev, [field]: value }));
    } else {
      setNewUser(prev => ({ ...prev, [field]: value }));
    }
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
        <UserHeader onRefresh={fetchUsers} onAddUser={handleOpenDialog} />

        <UserDataGrid
          users={users}
          loading={loading}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteUser}
        />
      </Paper>

      <UserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title="Create New User"
        user={newUser}
        onChange={(field, value) => handleUserChange(field, value)}
        onSubmit={handleCreateUser}
      />

      <UserDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        title="Edit User"
        user={editUser}
        onChange={(field, value) => handleUserChange(field, value, true)}
        onSubmit={handleUpdateUser}
        isEdit={true}
      />
    </Box>
  );
};

export default UsersPage;
