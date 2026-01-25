import { Box, Button, Stack } from "@mui/material";
import { TextRob16Font1S } from "../../../../../components/Text1S";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob14Font1Xs } from "../../../../../components/Text1Xs";
import { useDropzone } from "react-dropzone";
import { useUploadFile } from "../../../../../hooks/useUploadFile";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { UploadFileIcon } from "../../../../../icons/UploadFileIcon";
import { TextRob12Font2Xs } from "../../../../../components/Text2Xs";
import { CircleIcon } from "../../../../../icons/CircleIcon";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { useUserResources } from "../../../../../hooks/useUserResources";
import { useEffect } from "react";

export const PerfilPhotoUpload = () => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { handleUpload } = useUploadFile();
  const { uploadUserImage } = useUserResources();
  const { setImage, profileImgUrl, idUser } = useZUserProfile();
  const [uploadedFile, setUploadedFile] = useState<string | null>(profileImgUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  // Sincronizar com o perfil do usuário
  useEffect(() => {
    if (profileImgUrl) setUploadedFile(profileImgUrl);
  }, [profileImgUrl]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !idUser) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    const response = await uploadUserImage(idUser, file);
    setIsUploading(false);

    if (response && response.profileImgUrl) {
      setUploadedFile(response.profileImgUrl);
      setImage({
        imageUrl: response.profileImgUrl,
        objectName: file.name,
      });
    }
  };

  const handleRemoveLogo = () => {
    setImage({
      imageUrl: "",
      objectName: "",
    });
    setUploadedFile("");
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"] },
    maxSize: 50 * 1024 * 1024, // Limita para 50MB
  });

  return (
    <Stack sx={{ gap: "24px", width: "100%" }}>
      <Stack sx={{ width: "100%", gap: "8px" }}>
        <TextRob16Font1S
          sx={{
            color: theme[mode].black,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {t("profileAndNotifications.profileImg")}
        </TextRob16Font1S>
      </Stack>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        <Box
          {...getRootProps()}
          sx={{
            maxWidth: "329px",
            width: "100%",
            height: "169px",
            border: `1px solid ${theme[mode].grayLight}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            borderRadius: "16px",
            background: uploadedFile
              ? `url(${uploadedFile}) center/contain no-repeat`
              : (isDragActive ? theme[mode].grayLight : theme[mode].lightV2),
            cursor: "pointer",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <input {...getInputProps()} />
          {!uploadedFile && (
            <>
              <UploadFileIcon color={theme[mode].tertiary} />
              <TextRob12Font2Xs
                sx={{
                  color: theme[mode].tertiary,
                  fontWeight: "400",
                  fontSize: "12px",
                  maxWidth: "136px",
                  textAlign: "center",
                  lineHeight: "20px",
                  userSelect: "none",
                }}
              >
                {isUploading ? t("whiteLabel.loading") : t("whiteLabel.clickHere")}
              </TextRob12Font2Xs>
            </>
          )}
        </Box>

        <Stack sx={{ gap: "32px" }}>
          {/* above stack buttons of change and remove logo */}
          <Stack
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Button
              disableRipple
              sx={{
                boxSizing: "content-box",
                padding: "0",
                border: "none",
                background: "none",
                textTransform: "none",
                textDecoration: "underline",
                color: theme[mode].blueDark,
                "&:hover": {
                  color: theme[mode].primary,
                  textDecoration: "underline",
                },
                "&focus": {
                  outline: "none",
                },
              }}
              onClick={open}
            >
              {t("profileAndNotifications.changeImage")}
            </Button>
            <Button
              disableRipple
              sx={{
                boxSizing: "content-box",
                padding: "0",
                border: "none",
                background: "none",
                textTransform: "none",
                textDecoration: "underline",
                color: theme[mode].blueDark,
                "&:hover": {
                  color: theme[mode].primary,
                  textDecoration: "underline",
                },
                "&focus": {
                  outline: "none",
                  background: "none",
                },
              }}
              onClick={handleRemoveLogo} // Remove o logo
            >
              {t("profileAndNotifications.removeImage")}
            </Button>
          </Stack>
          {/* above stack of size and format infos */}
          <Stack
            sx={{
              gap: "8px",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CircleIcon color={theme[mode].blueDark} />
              <TextRob14Font1Xs
                sx={{
                  color: theme[mode].gray,
                  fontWeight: "400",
                  fontSize: "14px",
                }}
              >
                {t("whiteLabel.defaultSize")}
              </TextRob14Font1Xs>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CircleIcon color={theme[mode].blueDark} />
              <TextRob14Font1Xs
                sx={{
                  color: theme[mode].gray,
                  fontWeight: "400",
                  fontSize: "14px",
                }}
              >
                {t("whiteLabel.maxSize")}
              </TextRob14Font1Xs>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CircleIcon color={theme[mode].blueDark} />
              <TextRob14Font1Xs
                sx={{
                  color: theme[mode].gray,
                  fontWeight: "400",
                  fontSize: "14px",
                }}
              >
                {t("whiteLabel.acceptedFormats")}
              </TextRob14Font1Xs>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
