import { Box, Typography } from '@mui/material'
import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function BoxCaptionField({ caption, dir }) {
  return (
    <Box className='error-caption-box'>
      <Typography variant='caption' dir={dir ? dir : 'rtl'}>
        {caption}
      </Typography>
      <ErrorOutlineIcon sx={{ width: "1rem", height: "1rem" }} />
    </Box>
  )
}
