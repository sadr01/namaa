import { Box, Button, Stack } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import './setting.css'
import { useNavigate } from 'react-router-dom';



export default function SettingManager() {
  const navigate = useNavigate();

  const styleIcon = { position: 'absolute', right: 12 };
  const iconArrow = <ArrowBackIosIcon sx={{ position: 'absolute', left: 12 }} />;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      <Button variant="outlined" className='btn' onClick={() => navigate('/set/profile')}
        sx={{ mb: 3 }}>
        تنظیم صفحه شخصی
        <EditIcon sx={styleIcon} />
        {iconArrow}
      </Button>

      <Button variant="outlined" className='btn' onClick={() => navigate('/set/links')} sx={{ mb: 3 }} >
        لینک های من
        <InsertLinkIcon sx={styleIcon} />
        {iconArrow}
      </Button>
      <Button variant="outlined" className='btn' onClick={() => navigate('/set/socials')} sx={{ mb: 3 }}>
        شبکه های اجتماعی من
        <ChatBubbleIcon sx={styleIcon} />
        {iconArrow}
      </Button>
      <Button variant="outlined" className='btn' onClick={() => navigate('/chart')} sx={{ mb: 3 }}>
        آمار بازدیدها
        <LeaderboardIcon sx={styleIcon} />
        {iconArrow}
      </Button>
      <Button variant="outlined" className='btn' sx={{ mb: 3 }} onClick={() => navigate('/share')}>
        اشترک گذاری صفحه
        <ShareOutlinedIcon sx={styleIcon} />
        {iconArrow}
      </Button>
    </Box>
  )
}
