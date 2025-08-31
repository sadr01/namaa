import { createContext, useState, useContext } from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const LoadingContext = createContext();
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
        open={loading}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            لطفا صبر کنید...
          </Typography>
        </Box>
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
