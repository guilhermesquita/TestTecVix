import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const useSetupAxiosInterceptors = () => {
  const navigate = useNavigate();
  const { resetAllStates } = useZResetAllStates();
  const { t } = useTranslation();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Se receber erro 401 (Unauthorized/Token expirado)
        if (error.response?.status === 401) {
          resetAllStates();
          toast.warning(t("loginRegister.sessionExpired") || "Sessão expirada");
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, resetAllStates, t]);
};
