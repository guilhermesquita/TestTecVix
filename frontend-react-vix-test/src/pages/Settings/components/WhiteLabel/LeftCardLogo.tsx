import { useTranslation } from "react-i18next";
import { themeColors, useZTheme } from "../../../../stores/useZTheme";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TextRob16Font1S } from "../../../../components/Text1S";
import { Box, Button } from "@mui/material";
import { UploadFileIcon } from "../../../../icons/UploadFileIcon";
import { TextRob12Font2Xs } from "../../../../components/Text2Xs";
import { CircleIcon } from "../../../../icons/CircleIcon";
import { TextRob16FontL } from "../../../../components/TextL";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";
import { useBrandMasterResources } from "../../../../hooks/useBrandMasterResources";
import { useUploadFile } from "../../../../hooks/useUploadFile";
import { useZUserProfile } from "../../../../stores/useZUserProfile";

interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const LeftCardLogo = ({ theme }: IWhiteLabelChildProps) => {
  const { mode } = useZTheme();
  const { t } = useTranslation();
  const { uploadBrandLogo, updateBrandMaster } = useBrandMasterResources();
  const { getFileByObjectName } = useUploadFile();
  const { setBrandInfo, brandLogoTemp, brandLogo } = useZBrandInfo();
  const { idBrand } = useZUserProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    brandLogoTemp || brandLogo
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !idBrand) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    const response = await uploadBrandLogo(idBrand, file);
    setIsUploading(false);

    if (response && response.brandLogo) {
      const { url } = await getFileByObjectName(response.brandLogo);
      if (url) {
        setUploadedFile(url);
        setBrandInfo({
          brandLogoTemp: url,
          brandObjectName: response.brandLogo,
          brandLogo: url
        });
      }
    }
  };

  const handleRemoveLogo = async () => {
    setIsUploading(true);
    await updateBrandMaster({ brandLogo: "" }); // Envia string vazia para remover
    setIsUploading(false);

    setUploadedFile(null);
    setBrandInfo({ brandLogoTemp: "", brandLogo: "", brandObjectName: "" });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] },
    maxSize: 50 * 1024 * 1024, // Limita para 50MB
  });

  useEffect(() => {
    setUploadedFile(brandLogoTemp || brandLogo || null);
  }, [brandLogoTemp, brandLogo]);

  return (
    <>
      <TextRob16Font1S
        sx={{
          color: theme[mode].primary,
          fontWeight: "500",
          fontSize: "16px",
          marginBottom: "16px",
        }}
      >
        {t("whiteLabel.brandLogo")}
      </TextRob16Font1S>
      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          height: "216px",
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
          marginBottom: "24px",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "24px",
          "@media (max-width: 440px)": {
            flexDirection: "column",
          },
        }}
      >
        <Button
          sx={{
            background: theme[mode].blue,
            border: `1px solid ${theme[mode].blue}`,
            color: theme[mode].btnText,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 2,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            "@media (max-width: 440px)": {
              flexGrow: 0,
              width: "100%",
            },
          }}
          onClick={open}
        >
          {t("whiteLabel.changeLogo")}
        </Button>
        <Button
          onClick={handleRemoveLogo}
          disabled={!uploadedFile}
          sx={{
            background: "transparent",
            color: uploadedFile ? theme[mode].blueDark : theme[mode].gray,
            border: `1px solid ${uploadedFile ? theme[mode].blueDark : theme[mode].gray}`,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 1,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            cursor: uploadedFile ? "pointer" : "not-allowed",
            "@media (max-width: 440px)": {
              flexGrow: 0,
              width: "100%",
            },
          }}
        >
          {t("whiteLabel.removeLogo")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.defaultSize")}
          </TextRob16FontL>
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
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.maxSize")}
          </TextRob16FontL>
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
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.acceptedFormats")}
          </TextRob16FontL>
        </Box>
      </Box>
    </>
  );
};
