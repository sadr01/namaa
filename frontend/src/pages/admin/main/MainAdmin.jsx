import { Box } from '@mui/material'
import Header from './Header'
import NavMenu from './NavMenu'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom';
import MainAdminLayout from './MainAdminLayout'
import DrawerNavMenu from './DrawerNavMenu'
import './main.css'

export default function Main() {
  const [showMenu, setShowMenu] = useState(false);
  const showMenuHandler = () => setShowMenu(prev => !prev);


  return (
    <MainAdminLayout>
      <Box sx={{ width: "100%", minHeight: "100vh", height: "100vh", overflowY: 'hidden' }}>
        <Header setShowMenu={showMenuHandler} />
        <Box sx={{
          position: "fixed", top: "64px", right: 0,
          width: { xs: 0, sm: "15rem" }, height: `calc(100vh - ${"64px"})`, background: "#1b2a41", display: { xs: "none", sm: "flex" }, zIndex: 900,
        }}>
          <NavMenu />
        </Box>

        <Box sx={{ marginTop: "64px", marginRight: { xs: 0, sm: "15rem" }, height: `calc(100vh - ${"64px"})`, overflow: "auto", background: "#faf7f0", p: 3 }} dir="rtl"
        >
          <Outlet />
        </Box>

        <DrawerNavMenu showMenu={showMenu} showMenuHandler={showMenuHandler} >
          <NavMenu />
        </DrawerNavMenu>
      </Box>
    </MainAdminLayout>
  );
}
