import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Task as TaskIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const TaskSidebar = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const handleClick = () => {
      navigate('/tasks');
   };

   return (
      <ListItem
         button
         onClick={handleClick}
         sx={{
            '&:hover': {
               backgroundColor: 'rgba(0, 102, 255, 0.1)',
               cursor: 'pointer'
            },
            bgcolor: location.pathname.startsWith('/tasks') ?
               'rgba(0, 102, 255, 0.2)' : 'transparent',
         }}
      >
         <ListItemIcon sx={{ color: '#0066FF' }}>
            <TaskIcon />
         </ListItemIcon>
         <ListItemText
            primary="Tasks"
            sx={{ color: '#fff' }}
         />
      </ListItem>
   );
};

export default TaskSidebar; 