import { Box, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { getIconByTitle } from '../../../more/icons';
import { Link } from 'react-router-dom';

export default function Socials({ datas }) {

  return (
    <Box className="Socials-box" sx={{ mb: 2 }}>
      {datas?.map((item) => {
        return (
          <IconButton key={item.id} size="small" component={Link} to={`${item.app_link}${item.username}`}>
            {React.cloneElement(getIconByTitle(item.app_icon), { sx: { fontSize: '2rem' } })}
          </IconButton>
        )
      })
      }
    </Box>
  )
}
