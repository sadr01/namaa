import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import { adminTheme } from "../../../more/theme";
import { ModalProvider } from "../components/Dialog";
import { SnackbarProvider } from "../components/Snackbar";

export default function MainAdminLayout({ children }) {
  return (
    <ThemeProvider theme={adminTheme}>
      <SnackbarProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </SnackbarProvider>
    </ThemeProvider>

  );
}

