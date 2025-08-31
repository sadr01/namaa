
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppModal } from '../components/ModalContext';
import { useAuth } from '../../../context/authContext.js';
import fetchApi from '../../../more/fetchApi';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showModal } = useAppModal();

  const logoutHandler = async () => {
    let res = await fetchApi('/auth/logout')
    if (res.ok) {
      logout();
      navigate("/login");
      return null
    } else {
      showModal({
        content: <p >{res.data.message}</p>,
      });
    }
  };

  return (
    <Box className="form-box" >
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 6 }}>
        <LogoutIcon sx={{ width: 50, height: 50 }} />
      </Box>
      <Box sx={{ mb: 6 }}>
        <Typography >
          آیا برای خروج از حساب کاربری اطمینان دارید؟
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: '1rem', mb: 6 }} >
        <Button variant="contained" fullWidth onClick={() => logoutHandler()}
          sx={{ color: '#9720b1' }} >
          بله
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate("/me")}>
          خیر
        </Button>
      </Box>

      <Link to='/me'>
        <Typography variant="caption" >
          صفحه من
        </Typography>
      </Link>
    </Box>
  );
}
