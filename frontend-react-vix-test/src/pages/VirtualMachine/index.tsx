import { Stack } from "@mui/material";
import { useZTheme } from "../../stores/useZTheme";
import { shadow } from "../../utils/shadow";
import { FormVM } from "./components/FormVM";
import { CardCreateWithIA } from "./components/CardCreateWithIA";
import { useTranslation } from "react-i18next";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { TextRob12Font2Xs } from "../../components/Text2Xs";
import { SugestionsCards } from "./components/SugestionsCards";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { useEffect } from "react";
import { useZVM } from "../../stores/useZVM";
import { CardMarketPlace } from "./components/CardMarketPlace";
import { ModalSelectOS } from "./components/ModalSelectOS";
import { useOperatingSystems } from "../../hooks/useOperatingSystems";

export const VirtualMachinePage = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { newRandomPassword, resetAll } = useZVM();
  const { operatingSystems, isLoading: isLoadingOS } = useOperatingSystems();

  useEffect(() => {
    return () => {
      resetAll();
      newRandomPassword();
    };
  }, []);

  return (
    <ScreenFullPage
      title={
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "28px",
            fontWeight: "500",
            lineHeight: "40px",
          }}
        >
          {t("createVm.createVm")}
        </TextRob20Font1MB>
      }
      subtitle={
        <TextRob12Font2Xs
          sx={{
            color: theme[mode].gray,
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "20px",
          }}
        >
          {t("createVm.fillTheFields")}
        </TextRob12Font2Xs>
      }
      sxTitleSubTitle={{
        maxWidth: "1394px",
        "@media (max-width: 1700px)": {
          paddingLeft: "40px",
        },
      }}
    >
      <>
        <Stack
          width={"100%"}
          className=""
          flexDirection={"row"}
          sx={{
            backgroundColor: theme[mode].mainBackground,
            width: "82%",
            height: "100%",
            borderRadius: "16px",
            boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
            marginBottom: "24px",
            "@media (min-width: 1431px)": {
              marginBottom: "0px",
              maxWidth: "920px",
            },
          }}
        >
          <FormVM />
        </Stack>

        {/* IA modal card and sugestions */}
        <Stack
          sx={{
            width: "82%",
            marginBottom: "64px",
            justifyContent: "center",
            gap: "24px",
            "@media (min-width: 955px)": {
              maxWidth: "450px",
            },
            "@media (min-width: 1431px)": {
              marginBottom: "0px",
            },
          }}
        >
          {/* Sugestions */}
          <Stack
            sx={{
              display: "none",
              backgroundColor: theme[mode].mainBackground,
              boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
              borderRadius: "16px",
              maxHeight: "530px",
              "@media (min-width: 1431px)": {
                display: "block",
              },
            }}
          >
            <SugestionsCards />
          </Stack>
          {/* IA modal card */}
          <Stack
            width={"100%"}
            className=""
            flexDirection={"column"}
            sx={{
              backgroundColor: theme[mode].black,
              boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
              borderRadius: "12px",
            }}
          >
            <CardCreateWithIA />
          </Stack>
          {/* Market place card */}
          <Stack
            width="100%"
            height="100%"
            flexDirection="column"
            sx={{
              borderRadius: "12px",
              boxShadow: `0px 4px 4px 0px ${shadow(mode)}`,
              background: `
      linear-gradient(90deg, ${theme[mode].black} 0%, ${theme[mode].blueMedium} 100%), /* fundo linear */
      radial-gradient(ellipse at center, ${theme[mode].blue + "50"} 0%, ${theme[mode].blue} 100%) /* overlay tipo diamond */
    `,
              backgroundBlendMode: "normal, lighten",
            }}
          >
            <CardMarketPlace />
          </Stack>
        </Stack>

        {/* Modal for OS Selection */}
        <ModalSelectOS operatingSystems={operatingSystems} isLoading={isLoadingOS} />
      </>
    </ScreenFullPage>
  );
};
