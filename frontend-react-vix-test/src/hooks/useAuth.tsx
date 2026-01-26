import { useZUserProfile } from "../stores/useZUserProfile";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import moment from "moment";
import { api } from "../services/api";

const REFRESH_TIME = 50;

export const useAuth = () => {
  const { token, setUser, idUser } = useZUserProfile();
  const { loginTime, setLoginTime } = useZGlobalVar();

  const fetchNewUserToken = async () => {
    if (!idUser) return "";
    const response = await api.get<{ token: string | null }>({
      url: `/auth/token/${idUser}`,
      auth: { Authorization: `Bearer ${token}` },
      tryRefetch: true,
    });
    if (response.error || !response.data.token) {
      return "";
    }

    return response.data.token;
  };

  const getAuth = async (force = false) => {
    if (
      !force &&
      token &&
      loginTime &&
      moment(loginTime).add(REFRESH_TIME, "minutes") > moment()
    ) {
      return { Authorization: `Bearer ${token}` };
    }

    setLoginTime(new Date());

    const newToken = await fetchNewUserToken();
    setUser({ token: newToken });
    return { Authorization: `Bearer ${newToken || token}` };
  };

  return {
    getAuth,
  };
};
