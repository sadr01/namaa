import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import DrawerNav from './DrawerNav';
import NavMenu from './NavMenu';
import { Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';
import './main.css'
export default function Main(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <MainLayout>
      <Box className="bg-gradient" sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        <NavMenu handleDrawerToggle={handleDrawerToggle} />
        <nav>
          <DrawerNav
            window={window}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </nav>
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          p: 3, mt: 10, width: '100%',
        }}  >
          <Box sx={{ width: { xs: '100%', sm: 500 } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
