import { Box, Typography } from '@mui/material'

export default function Logo({ size, font }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      my: 2, gap: 1
    }}>
      <Typography variant={font} >
        نَما
      </Typography>
      <img src="/logo.svg" alt="logo" width={size} height={size} />
    </Box>
  )
}
