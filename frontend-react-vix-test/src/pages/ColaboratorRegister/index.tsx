import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../stores/useZTheme";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { TextRob16Font1S } from "../../components/Text1S";
import { ColaboratorForm } from "./components/ColaboratorForm";
import { ColaboratorTable } from "./ColaboratorTable/ColaboratorTable";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { useUserResources } from "../../hooks/useUserResources";

export const ColaboratorRegisterPage = () => {
    const { t } = useTranslation();
    const { theme, mode } = useZTheme();
    const { isLoading } = useUserResources();

    return (
        <ScreenFullPage
            title={
                <Stack>
                    <TextRob20Font1MB
                        sx={{
                            color: theme[mode].primary,
                            fontSize: "28px",
                            fontWeight: "500",
                            lineHeight: "40px",
                        }}
                    >
                        {t("colaboratorRegister.title")} | {t("colaboratorRegister.sideTitle")}
                    </TextRob20Font1MB>
                    <TextRob16Font1S sx={{ color: theme[mode].tertiary, fontWeight: "400" }}>
                        {t("colaboratorRegister.subtitle")}
                    </TextRob16Font1S>
                </Stack>
            }
            sxTitleSubTitle={{
                paddingLeft: "40px",
                paddingRight: "40px",
            }}
            sxContainer={{
                paddingLeft: "40px",
                paddingRight: "40px",
                paddingBottom: "40px",
            }}
        >
            {isLoading && <AbsoluteBackDrop open />}

            <Stack sx={{ width: "100%", gap: "4px" }}>
                <ColaboratorForm />
                <ColaboratorTable />
            </Stack>
        </ScreenFullPage>
    );
};
