import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useLoading } from '../../../context/loadingContext';
import { useEffect } from "react";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { setLoading } = useLoading();


  useEffect(() => {
    setLoading(loading);
  }, [loading])

  if (loading) return null;
  return children;
};

export default GuestRoute;