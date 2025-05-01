import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon,
  CloudDownload as DownloadIcon,
  Delete as DeleteIcon,
  FileUpload as UploadIcon,
} from '@mui/icons-material';

const FilesPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Dummy data for demonstration
  const rows = [
    { 
      id: 1, 
      name: 'document.pdf', 
      size: '2.5 MB',
      type: 'application/pdf',
      uploadedBy: 'john_doe',
      uploadedAt: '2025-05-01' 
    },
    { 
      id: 2, 
      name: 'image.jpg', 
      size: '1.8 MB',
      type: 'image/jpeg',
      uploadedBy: 'jane_smith',
      uploadedAt: '2025-05-01' 
    },
    { 
      id: 3, 
      name: 'data.xlsx', 
      size: '500 KB',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedBy: 'admin_user',
      uploadedAt: '2025-05-01' 
    },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'File Name', width: 200 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'type', headerName: 'Type', width: 200 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 },
    { field: 'uploadedAt', headerName: 'Uploaded At', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" size="small">
            <DownloadIcon />
          </IconButton>
          <IconButton color="error" size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        handleCloseDialog();
      }
    }, 500);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          File Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Upload File
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
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              type="file"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
              >
                Select File
              </Button>
            </label>
            {selectedFile && (
              <Typography sx={{ mt: 2 }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile || uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FilesPage;
