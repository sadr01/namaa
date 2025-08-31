import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer';
import Logo from '../components/Logo';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
const drawerWidth = 240;
const menues = [
  { title: 'ثبت نام', link: '/register', role: 'guest' },
  { title: 'ورود', link: '/login', role: 'guest' },
  { title: 'صفحه من', link: '/me', role: 'user' },
  { title: 'مدیریت صفحه', link: '/set', role: 'user' },
  { title: 'تغییر رمز عبور', link: '/changepass', role: 'user' },
  { title: 'پیام ناشناس', link: '', role: 'user' },
  { title: 'خروج از حساب', link: '/logout', role: 'user' },
]

export default function DrawerNav({ window, mobileOpen, handleDrawerToggle }) {
  const container = window !== undefined ? () => window().document.body : undefined;
  //const [navItems, setNavItems] = useState(menues);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return (
    <Drawer
      container={container}
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <Box className="bg-gradient" onClick={handleDrawerToggle} sx={{
        textAlign: 'center',
        minHeight: '100vh',
      }}>
        <Logo size={30} font='h6' />

        <Divider />

        <List>
          {menues
            .filter(menu => {
              if (menu.role === 'all') return true;
              if (!user && menu.role === 'guest') return true; // مهمان‌ها
              if (user && menu.role === 'user') return true; // کاربر خاص
              return false;
            })
            .map((menu, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton sx={{ textAlign: 'center' }} onClick={() => navigate(menu.link)}>
                  <ListItemText primary={menu.title} />
                </ListItemButton>
              </ListItem>
            ))
          }


        </List>
      </Box>
    </Drawer>

  )
}
