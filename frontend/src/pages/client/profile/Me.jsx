import React, { useEffect } from 'react'
import { useAuth } from '../../../context/authContext'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppModal } from '../components/ModalContext';

export default function Me() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();
  if (user?.username) {
    return <Navigate to={`/@${user.username}`} replace />;
  }

  return <Navigate to="/set/profile" replace />;
}


