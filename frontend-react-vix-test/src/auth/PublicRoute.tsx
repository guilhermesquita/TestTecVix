import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useZUserProfile } from "../stores/useZUserProfile";
import { LoadingApp } from "./LoadingApp";

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { idUser, token } = useZUserProfile();

  if (idUser && token) {
    return <Navigate to="/" replace />;
  }

  return <LoadingApp notLoginPage>{children}</LoadingApp>;
};
