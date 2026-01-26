import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../../components/TextL";
import { toast } from "react-toastify";
import { useUserResources } from "../../../../../hooks/useUserResources";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { useZFormProfileNotifications } from "../../../../../stores/useZFormProfileNotifications";

export const CTAsButtons = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { updateUser } = useUserResources();
  const { idUser } = useZUserProfile();
  const {
    userEmail,
    userName,
    userPhone,
    password,
    confirmPassword,
    fullNameForm,
    setFormProfileNotifications
  } = useZFormProfileNotifications();

  const handleSave = async () => {
    if (password.value && password.value !== confirmPassword.value) {
      toast.error(t("colaboratorRegister.dontMatch"));
      return;
    }

    const response = await updateUser(idUser, {
      username: userName.value,
      email: userEmail.value,
      password: password.value || undefined,
    });

    if (response) {
      setFormProfileNotifications({
        password: { ...password, value: "" },
        confirmPassword: { ...confirmPassword, value: "" }
      });
    }
  };

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
      }}
    >
      <Button
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleSave}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].btnText,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.saveChanges")}
        </TextRob16FontL>
      </Button>
      <Button
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={() => { }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].blueDark,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.redefineAllData")}
        </TextRob16FontL>
      </Button>
    </Stack>
  );
};
