import { FormControl, InputLabel, Stack } from "@mui/material";
import { useZTheme } from "../../../../stores/useZTheme";
import { TextRob32Font1L } from "../../../../components/Text1L";
import { TextRob18Font2M } from "../../../../components/Text2M";
import { SimpleInput } from "../../../../components/Inputs/SimpleInput";
import { useTranslation } from "react-i18next";

interface IProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onEnterPassword?: () => void;
}

export const LoginForm = ({
  password,
  setPassword,
  onEnterPassword,
  email,
  setEmail,
}: IProps) => {
  const { mode, theme } = useZTheme();
  const { t } = useTranslation();
  return (
    <Stack
      className=" py-5 gap-5"
      sx={{
        width: "100%",
      }}
    >
      <TextRob32Font1L
        sx={{
          color: theme[mode].dark,
          fontSize: "24px",
        }}
      >
        {t("loginRegister.access")}
      </TextRob32Font1L>
      {/* username */}
      <FormControl variant="standard">
        <InputLabel
          shrink
          htmlFor="bootstrap-input-email"
          className="username"
          sx={{
            color: theme[mode].dark,
            "&.Mui-focused": {
              color: theme[mode].blue,
            },
          }}
        >
          <TextRob18Font2M>{t("loginRegister.email")}</TextRob18Font2M>
        </InputLabel>
        <SimpleInput
          id="bootstrap-input-email"
          // sx={{ height: "48px" }}
          type="text"
          inputSx={{ height: "48px", borderRadius: "12px" }}
          value={email}
          onChange={setEmail}
        />
      </FormControl>
      {/* password */}
      <FormControl variant="standard">
        <InputLabel
          shrink
          htmlFor="bootstrap-input-password"
          className="password"
          sx={{
            color: theme[mode].dark,
            "&.Mui-focused": {
              color: theme[mode].blue,
            },
          }}
        >
          <TextRob18Font2M>{t("loginRegister.password")}</TextRob18Font2M>
        </InputLabel>
        <SimpleInput
          id="bootstrap-input-password"
          type="password"
          value={password}
          inputSx={{ height: "48px", borderRadius: "12px" }}
          onChange={setPassword}
          onEnter={onEnterPassword}
        />
      </FormControl>
    </Stack>
  );
};
