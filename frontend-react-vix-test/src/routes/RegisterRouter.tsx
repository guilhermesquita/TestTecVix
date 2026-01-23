import { LoadingApp } from "../auth/LoadingApp";
import { RegisterPage } from "../pages/Register";

export const RegisterRouter = {
  path: "/register",
  element: (
    <LoadingApp notLoginPage>
      <RegisterPage />
    </LoadingApp>
  ),
};
