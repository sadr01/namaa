import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import './modalContext.css'
const ModalContext = createContext();

export function useAppModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    title: "",
    content: null,
    actions: null,
  });

  const showModal = ({ title, content, actions }) => {
    setModal({ open: true, title, content, actions });
  };

  const hideModal = () => setModal((m) => ({ ...m, open: false }));

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      <Dialog open={modal.open} onClose={hideModal}>
        {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
        {modal.content && <DialogContent
          sx={{ textAlign: 'center' }}
        >{modal.content}</DialogContent>}
        {modal.actions && <DialogActions
          sx={{ display: 'flex', justifyContent: 'center', mx: '0.1rem' }}
        >{modal.actions}</DialogActions>}
      </Dialog>
    </ModalContext.Provider>
  );
}
