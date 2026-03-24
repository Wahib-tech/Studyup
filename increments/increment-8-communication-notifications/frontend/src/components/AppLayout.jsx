import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, Drawer, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      {/* Sidebar for Desktop */}
      {!isMobile && <Sidebar />}

      {/* Sidebar for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bgcolor: '#0f172a', border: 'none' },
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
        width: { xs: '100%', md: 'calc(100% - 280px)' }
      }}>
        <TopBar onMenuClick={handleDrawerToggle} isMobile={isMobile} />
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default AppLayout;
