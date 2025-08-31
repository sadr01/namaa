
import React, { useEffect, useState } from 'react'
import { Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox({ search, setSearch }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
      background: '#fff', borderRadius: "3px", border: '1px solid #4C5C68'
    }}>
      <TextField
        size="small"
        placeholder="جستجو"
        variant="outlined"
        sx={{
          backgroundColor: '#fff',
          borderRadius: 2,
          '& .MuiOutlinedInput-root': {
            height: 25,
            fontSize: 13,
            padding: '0 8px',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SearchIcon sx={{ ml: 1, color: '#4C5C68' }} />
    </Box>
  )
}
