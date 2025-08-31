import React, { createContext, useContext, useState } from "react";
import { Snackbar, Slide } from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("useSnackbar باید داخل SnackbarProvider استفاده بشه");
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        message={message}
        autoHideDuration={2500}
        ContentProps={{
          sx: {
            backgroundColor: "#4C5C68",
            color: "#faf7f0",
            display: 'flex',
            justifyContent: 'center',
            fontSize: "1rem",
          },
        }}
      />
    </SnackbarContext.Provider>
  );
};
