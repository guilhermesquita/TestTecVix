import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { useZBrandInfo } from "../stores/useZBrandStore";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const { t } = useTranslation();
  const { idBrand } = useZBrandInfo();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t("loginRegister.invalidEmail");
    }
    return null;
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (!password) return t("loginRegister.invalidPassword");
    if (password.length < 8) {
      return t("loginRegister.passwordTooShort");
    }
    if (password !== confirmPassword) {
      return t("loginRegister.passwordMismatch");
    }
    return null;
  };
  const goRegister = async ({
    username,
    password,
    email,
    confirmPassword,
  }: {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
  }) => {
    if (!username) {
      toast.error(t("loginRegister.invalidUsername"));
      return;
    }
    const emailError = validateEmail(email);
    const passwordError = validatePasswords(password, confirmPassword);
    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    const response = await api.post({
      url: "/auth/register",
      data: {
        username,
        password,
        email,
        idBrandMaster: idBrand || undefined,
      },
    });

    if (response.error) {
      toast.error(response.message);
      return;
    }

    toast.success(t("loginRegister.registrationSuccess"));
    return navigate("/login");
  };

  return { goRegister };
};
