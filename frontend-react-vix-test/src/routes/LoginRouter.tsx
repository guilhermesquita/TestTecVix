import { LoadingApp } from "../auth/LoadingApp";
import { LoginPage } from "../pages/Login";

export const LoginRouter = {
  path: "/login",
  element: (
    <LoadingApp notLoginPage>
      <LoginPage />
    </LoadingApp>
  ),
};
