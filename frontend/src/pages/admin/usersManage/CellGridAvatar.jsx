import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'

export default function AvatarForGrid({ photo, click }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
      <Avatar onClick={() => click()}
        src={`${process.env.REACT_APP_API_URL}/public${photo}`}
        sx={{ width: 35, height: 35, cursor: 'pointer' }}
      />
    </Box>
  )
}
