
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

export default function LoadingOverlay({ open }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      open={open}
    >
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          لطفا صبر کنید...
        </Typography>
      </Box>
    </Backdrop>
  );
}

