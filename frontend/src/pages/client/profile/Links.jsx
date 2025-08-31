import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIconByTitle } from '../../../more/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useAppModal } from '../components/ModalContext';

export default function Links({ datas }) {
  const { showModal, hideModal } = useAppModal();
  const goToLink = (title, link) => {
    showModal({
      title: <Typography sx={{ color: '#9720b1', textAlign: 'center' }}>{title}</Typography>,
      content: <Typography
        sx={{
          direction: 'ltr',
          color: '#2092b1',
          textAlign: 'center',
          wordBreak: 'break-word',   // اگه متن طولانی بود بشکنه
          overflowWrap: 'break-word',// برای مرورگرهای دیگه
          textDecoration: 'underline', // خط زیر متن
          textDecorationThickness: '1px', // ضخامت خط
          textDecorationColor: '#2092b1',    // رنگ خط
        }}
      >
        {link}
      </Typography>,
      actions: <>
        <Button variant='outlined' className='btn' sx={{ color: ' #9720b1', border: '1px solid #000' }} onClick={() => hideModal()}>
          انصراف
        </Button>
        <Button variant='contained' className='btn' sx={{ background: ' #9720b1' }} component={Link} to={link}>
          برو
        </Button>

      </>,
    })

  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {datas?.map((item) => {
        return (
          <Button key={item.id} variant="outlined" className='btn' onClick={() => goToLink(item.title, item.link)}
            sx={{ mb: 2 }}>
            {item.title}
            {React.cloneElement(getIconByTitle(item.icon_title), { sx: { position: 'absolute', right: 12 } })}
            <ArrowBackIosIcon sx={{ position: 'absolute', left: 12 }} />
          </Button>
        )
      })}
    </Box>
  )
}
