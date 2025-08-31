import React from "react";
import { LoadingProvider } from "../../../context/loadingContext";
import { ModalProvider } from "../components/ModalContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { useLoading } from "../../../context/loadingContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from '@mui/material/styles';
import { clientTheme } from "../../../more/theme";

export default function MainLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="299740948551-e0aff45op1n0o3e7f7m0m54mdlm9tf44.apps.googleusercontent.com">
      <ThemeProvider theme={clientTheme}>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}


