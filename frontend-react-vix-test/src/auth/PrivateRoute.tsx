import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useZUserProfile } from "../stores/useZUserProfile";
import { FullPage } from "../components/Skeletons/FullPage";
import { useLoadingApp } from "../hooks/useLoadingApp";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { idUser, token } = useZUserProfile();
  const { loading } = useLoadingApp();

  if (loading) {
    return <FullPage />;
  }

  if (!idUser || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
