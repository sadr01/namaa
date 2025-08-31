import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Logo from '../components/Logo';
import { useAuth } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';


export default function HomeBar({ handleDrawerToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <AppBar sx={{
      backgroundColor: " rgba(255, 0, 0, 0)",

    }} component="nav">
      <Toolbar>
        <Box sx={{
          display: { sm: 'none', xs: 'flex' },
          flexDirection: { xs: 'row-reverse' }, width: '100%',
          justifyContent: 'space-between', color: '#fff'
        }}>
          <IconButton color='inherit' onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <IconButton color='inherit' >
            <HelpOutlineOutlinedIcon />
          </IconButton>
        </Box>
        <Box sx={{
          display: { xs: 'none', sm: 'flex' }, width: '100%', height: 'auto',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <Box>
            <Logo size={30} font='h6' />
          </Box>

          {user ?
            <Box>
              <Button onClick={() => navigate('/me')}>
                صفحه من
              </Button>
              <Button onClick={() => navigate('/set')}>
                مدیریت صفحه
              </Button>
              <Button onClick={() => navigate('/logout')}>
                خروج از حساب
              </Button>
            </Box>


            :
            <Box>
              <Button onClick={() => navigate('/login')}>
                ورود
              </Button>
              <Button onClick={() => navigate('/register')} >
                ثبت نام
              </Button>
            </Box>}

        </Box>


      </Toolbar>
    </AppBar>
  )
}
