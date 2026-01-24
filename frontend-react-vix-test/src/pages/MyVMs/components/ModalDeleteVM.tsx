import React from "react";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { Modal, Stack } from "@mui/material";
import { TextRob32Font1L } from "../../../components/Text1L";
import { TextRob16FontL } from "../../../components/TextL";
import { ActionButton } from "../../../components/Buttons/ActionButton";
import { TextRob14FontXsB } from "../../../components/TextXsB";

interface IProps {
  idVM?: number;
  vmName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ModalDeleteVM = ({
  idVM,
  vmName,
  onConfirm,
  onCancel,
}: IProps) => {
  const { t } = useTranslation();

  const { theme, mode } = useZTheme();

  return (
    <Modal
      open={Boolean(idVM)}
      onClose={onCancel}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        direction="column"
        sx={{
          backgroundColor: theme[mode].mainBackground,
          width: "350px",
          borderRadius: "8px",
          padding: "24px",
          gap: "12px",
        }}
      >
        {/* Title */}
        <TextRob32Font1L
          sx={{
            color: theme[mode].primary,
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          {t("createVm.deleteVM")}
        </TextRob32Font1L>

        {/* Description */}
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextRob16FontL
            sx={{
              color: theme[mode].gray,
              cursor: "pointer",
            }}
          >
            {`${t("createVm.deleteVMConfirm")} ${vmName}?`}
          </TextRob16FontL>
        </Stack>
        {/* Buttons */}
        <Stack
          sx={{
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: "8px",
            flexDirection: "row",
          }}
        >
          <ActionButton
            backgroundColor={"transparent"}
            onClick={onConfirm}
            sx={{
              borderRadius: "12px",
              height: "32px",
              width: "120px",
              border: `1px solid ${theme[mode].danger}`,
            }}
            text={
              <TextRob14FontXsB
                sx={{
                  fontSize: "12px",
                  color: theme[mode].danger,
                  fontWeight: "400",
                }}
              >
                {t("createVm.deleteVM").replace("VM", "")}
              </TextRob14FontXsB>
            }
          />
          <ActionButton
            onClick={onCancel}
            text={
              <TextRob14FontXsB
                sx={{
                  fontSize: "12px",
                  color: theme[mode].gray,
                  fontWeight: "500",
                  lineHeight: "16px",
                }}
              >
                {t("generic.cancel")}
              </TextRob14FontXsB>
            }
            sx={{
              backgroundColor: theme[mode].grayLight,
              width: "100px",
              height: "32px",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: theme[mode].grayLight,
                opacity: 0.8,
              },
            }}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};
