import { Box, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header({ setShowMenu }) {
  return (
    <Box
      sx={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "64px", background: "#4c5c68", zIndex: 1000,
        '& *': { color: '#faf7f0' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0px 5px 20px 5px #00000055'
      }}
    >
      <Box sx={{ display: { sm: 'flex', xs: 'none' }, gap: 1, alignItems: 'center', mr: 4 }}>
        <img src="/logo.svg" alt="logo" width={30} height={30} color='#faf7f0' />
        <Typography >
          پنل مدیریت پلتفرم نما
        </Typography>
      </Box>
      <Box sx={{ display: { sm: 'flex', xs: 'none' }, gap: 2, alignItems: 'center', ml: 4 }}>
        <MailOutlineIcon />
        <NotificationsNoneIcon />
        <LogoutIcon />
      </Box>
      <Box sx={{ display: { sm: 'none', xs: 'flex' }, gap: 2, alignItems: 'center', mx: 2 }}>
        <MenuIcon onClick={setShowMenu} />

      </Box>

    </Box>
  )
}
