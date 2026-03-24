import React from 'react';
import { Box, TextField, InputAdornment, IconButton, Typography, Badge, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';

const TopBar = ({ onMenuClick, isMobile }) => {
  return (
    <Box sx={{ 
      height: 80, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      px: { xs: 2, md: 4 }, 
      bgcolor: '#0f172a', 
      position: 'sticky', 
      top: 0, 
      zIndex: 10,
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} sx={{ color: '#f8fafc' }}>
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Search Section (Hidden on very small screens or made compact) */}
        <Box sx={{ width: { xs: 150, sm: 250, md: 400 } }}>
          <TextField 
            fullWidth
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} /></InputAdornment>,
              sx: { 
                borderRadius: 4, 
                bgcolor: '#1e293b', 
                color: '#f8fafc',
                fontSize: '0.9rem',
                '& fieldset': { border: 'none' }
              }
            }}
          />
        </Box>
      </Box>

      {/* Actions Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#f8fafc' } }}>
          <LanguageIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>English</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
          <IconButton sx={{ color: '#94a3b8', bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155', color: '#f8fafc' }, p: { xs: 0.8, md: 1.2 } }}>
            <Badge color="error" variant="dot">
              <ChatBubbleOutlineIcon fontSize="small" />
            </Badge>
          </IconButton>
          
          <IconButton sx={{ color: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.1)', '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' }, p: { xs: 0.8, md: 1.2 } }}>
            <Badge color="info" variant="dot">
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Box>

        <Button 
          variant="contained" 
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none', 
            fontWeight: 700, 
            bgcolor: '#38bdf8', 
            color: '#0f172a',
            px: { xs: 1.5, md: 3 },
            py: 0.8,
            fontSize: { xs: '0.75rem', md: '0.875rem' },
            boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)',
            '&:hover': { bgcolor: '#7dd3fc' }
          }}
        >
          {isMobile ? 'Quiz' : 'Generate Quiz'}
        </Button>
      </Box>
    </Box>
  );
};

export default TopBar;
