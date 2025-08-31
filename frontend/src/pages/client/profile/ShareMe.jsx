import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, IconButton, Stack } from '@mui/material';
import { useAuth } from '../../../context/authContext.js';
import { Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import QRCode from '../components/QRCode'
import { useAppModal } from '../components/ModalContext.jsx';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showModal, hideModal } = useAppModal();
  const navigate = useNavigate();

  const copyHandler = () => {
    let link = 'http://namaa.com/@' + user?.username;
    setCopied(true);
    navigator.clipboard.writeText(link);
  };

  useEffect(() => {
    if (!user?.username) {
      showModal({
        content: <p> ابتدا اطلاعات مربوط به صفحه خود را کامل کنید!</p>
      });
      navigate(`/set/profile`);
    }
  }, []);

  return (
    <Box sx={{
      width: { xs: '100%', sm: 500 }, display: 'flex', flexDirection: 'column', alignItems: 'center'
    }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6, width: 180, height: 50, alignItems: 'center', background: '#ffffff44', borderRadius: "3rem" }}>
        <Box >
          <Stack spacing={2} sx={{ border: '1px solid #ffffff44', borderRadius: '50%' }}>
            <Avatar
              src={`${process.env.REACT_APP_API_URL}/public${user.photo}`}
              sx={{ width: 50, height: 50, boxShadow: "0 0 12px rgba(255,119,232,0.7)" }}
              imgProps={{
                onLoad: () => setLoading(false),
                onError: () => setLoading(false),
              }} />
          </Stack>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant='h6' >
            {user?.name}
          </Typography>
          <Typography variant='caption' dir='ltr' sx={{ direction: 'ltr' }} >
            @{user?.username}
          </Typography>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        borderRadius: 5, height: 180, width: 180, background: "linear-gradient(145deg, #ffffff, #f3f3f3)",
        boxShadow: "0 0 20px rgba(255,119,232,0.6), 0 0 40px rgba(88,83,237,0.3)",
        border: "2px solid #ff77e888", mb: 5
      }}>
        <QRCode link={`http://namaa.com/@${user?.username}`} />
      </Box>
      <Box sx={{
        display: 'flex', px: 1, height: 30, justifyContent: 'center', alignItems: 'center', background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: "3rem", gap: 1
      }}
      >
        <Link to={`http://namaa.com/@${user?.username}`} >
          <Typography variant='caption' sx={{
            display: "inline-block",
            width: "100%",
            textAlign: "center"
          }} >
            namaa.com/@{user?.username}</Typography>
        </Link>
        {copied ? <DoneOutlinedIcon sx={{ fontSize: '1rem' }} onClick={copyHandler} />
          : <ContentCopyOutlinedIcon sx={{ fontSize: '1rem' }} onClick={copyHandler} />
        }
      </Box>
    </Box >
  )
}
