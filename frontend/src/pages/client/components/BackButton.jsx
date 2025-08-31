import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ address }) {
  const navigate = useNavigate();
  return (
    <IconButton aria-label="delete" onClick={() => navigate(address)}
      sx={{ color: "#fff" }}>
      <ArrowBackIcon />
    </IconButton>
  )
}
