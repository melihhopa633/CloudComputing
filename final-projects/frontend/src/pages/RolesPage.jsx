import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import roleService from '../services/roleService';
import Swal from 'sweetalert2';
import RoleHeader from '../components/roles/RoleHeader';
import RoleDataGrid from '../components/roles/RoleDataGrid';
import RoleDialog from '../components/roles/RoleDialog';

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

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    roleName: '',
  });
  const [editRole, setEditRole] = useState({
    roleName: '',
  });

  useEffect(() => {
    fetchRoles();
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
      confirmButtonClass: 'swal2-confirm-button',
      customClass: {
        confirmButton: 'swal2-confirm-button',
      },
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
      html: `<div style="font-size: 1.1rem; margin-top: 1rem;">${message}</div>`,
      confirmButtonClass: 'swal2-confirm-button',
      customClass: {
        confirmButton: 'swal2-confirm-button',
      },
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

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleService.getAll();
      setRoles(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRole({ roleName: '' });
  };

  const handleOpenEditDialog = (role) => {
    setSelectedRole(role);
    setEditRole({
      roleName: role.roleName,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedRole(null);
    setEditRole({ roleName: '' });
  };

  const handleCreateRole = async () => {
    try {
      await roleService.create(newRole);
      await fetchRoles();
      handleCloseDialog();
      setError(null);
      showSuccessAlert('Success', 'Role created successfully');
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    }
  };

  const handleUpdateRole = async () => {
    try {
      const updateData = {
        id: selectedRole.id,
        roleName: editRole.roleName
      };
      await roleService.update(selectedRole.id, updateData);
      await fetchRoles();
      handleCloseEditDialog();
      setError(null);
      showSuccessAlert('Success', 'Role updated successfully');
    } catch (err) {
      setError(err.message);
      showErrorAlert('Error', err.message);
    }
  };

  const handleDeleteRole = async (id) => {
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
          await roleService.delete(id);
          await fetchRoles();
          setError(null);
          showSuccessAlert('Deleted!', 'Role has been deleted.');
        } catch (err) {
          setError(err.message);
          showErrorAlert('Error', err.message);
        }
      }
    });
  };

  const handleRoleChange = (field, value, isEdit = false) => {
    if (isEdit) {
      setEditRole(prev => ({ ...prev, [field]: value }));
    } else {
      setNewRole(prev => ({ ...prev, [field]: value }));
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
        <RoleHeader onRefresh={fetchRoles} onAddRole={handleOpenDialog} />

        <RoleDataGrid
          roles={roles}
          loading={loading}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteRole}
        />
      </Paper>

      <RoleDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title="Create New Role"
        role={newRole}
        onChange={(field, value) => handleRoleChange(field, value)}
        onSubmit={handleCreateRole}
      />

      <RoleDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        title="Edit Role"
        role={editRole}
        onChange={(field, value) => handleRoleChange(field, value, true)}
        onSubmit={handleUpdateRole}
        isEdit={true}
      />
    </Box>
  );
};

export default RolesPage;
