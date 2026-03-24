import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { connectSocket, disconnectSocket } from '../services/socketService';

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const studentId = user.linked_id || user.id;
      connectSocket(studentId);
    }
    return () => disconnectSocket();
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        '@media print': { bgcolor: 'transparent' } 
    }}>
      {/* Sidebar for Desktop - print-hide class already in Sidebar component */}
      {!isMobile && <Sidebar />}
 
      {/* Sidebar for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        className="print-hide"
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bgcolor: 'background.default', border: 'none' },
          '@media print': { display: 'none !important' }
        }}
      >
        <Sidebar mobile onClose={handleDrawerToggle} />
      </Drawer>
 
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        ml: { xs: 0, md: '280px' }, 
        display: 'flex', 
        flexDirection: 'column',
        width: { xs: '100%', md: 'calc(100% - 280px)' },
        '@media print': { ml: 0, width: '100%', bgcolor: 'white' }
      }}>
        <TopBar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
        <Box sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 4 },
            '@media print': { p: 0 } 
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default AppLayout;
