import React, { useState, useEffect } from 'react';
import { Button, Collapse, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLocation } from 'react-router-dom';

const LogViewerSidebar = () => {
   const [open, setOpen] = useState(false);
   const location = useLocation();
   const isFullPage = location.pathname === '/log-viewer';
   const logViewerUrl = process.env.REACT_APP_LOG_VIEWER_URL || 'http://localhost:9098';

   // Tam sayfa modunda otomatik olarak açık olsun
   useEffect(() => {
      if (isFullPage) {
         setOpen(true);
      }
   }, [isFullPage]);

   const handleToggle = () => setOpen((prev) => !prev);

   return (
      <Box sx={{ width: '100%', height: isFullPage ? '100vh' : 'auto', pt: isFullPage ? 1 : 0 }}>
         {!isFullPage && (
            <Button
               variant="contained"
               color={open ? 'secondary' : 'primary'}
               startIcon={open ? <VisibilityOffIcon /> : <VisibilityIcon />}
               onClick={handleToggle}
               sx={{ width: '100%', mb: 1, fontWeight: 700 }}
            >
               {open ? 'Logları Gizle' : 'Logları Göster'}
            </Button>
         )}

         <Collapse in={open || isFullPage}>
            <Box sx={{
               width: '100%',
               height: isFullPage ? 'calc(100vh - 20px)' : 400,
               mt: 1,
               borderRadius: 2,
               overflow: 'hidden',
               boxShadow: 2,
               border: '2px solid #18304a'
            }}>
               <iframe
                  src={logViewerUrl}
                  title="SEQ Logları"
                  style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                  allowFullScreen
               />
            </Box>
         </Collapse>
      </Box>
   );
};

export default LogViewerSidebar; 