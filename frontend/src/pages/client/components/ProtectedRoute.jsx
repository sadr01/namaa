import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useLoading } from '../../../context/loadingContext';
import { useEffect } from "react";

export default function ProtectedRoute({ children, access }) {
  const { user, loading } = useAuth();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(loading);

  }, [loading])

  if (loading) setLoading(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (access && user.access === 0) return <Navigate to="/verifymail" replace />;
  if (access && user.access < access) return <Navigate to="/404" replace />;

  return children;
}
