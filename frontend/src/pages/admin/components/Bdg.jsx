
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 25,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function CustomizedBadges({ number, children }) {
  return (
    <StyledBadge badgeContent={number} color="success" sx={number == 0 && { opacity: 0.5 }}>
      {children}
    </StyledBadge>
  );
}
