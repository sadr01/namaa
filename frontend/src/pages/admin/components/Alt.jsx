import { Box, Tooltip } from '@mui/material'
import React from 'react'

export default function Alt({ text, children }) {
  return (
    <Box sx={{ height: 'auto', cursor: 'pointer' }}>
      <Tooltip title={text} placement="top" enterDelay={400} arrow >
        {children}
      </Tooltip>
    </Box>
  )
}
