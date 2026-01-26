import { Stack, Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { TextRob18Font2M } from "../../../components/Text2M";
import { CheckboxLabel } from "../../VirtualMachine/components/CheckboxLabel";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";
import { toast } from "react-toastify";
import { LabelInput } from "../../../components/Inputs/LabelInputs";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { useRef, useState } from "react";
import { useZUserProfile } from "../../../stores/useZUserProfile";
import { useDropzone } from "react-dropzone";
import { UploadFileIcon } from "../../../icons/UploadFileIcon";
import { CircleIcon } from "../../../icons/CircleIcon";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { Button } from "@mui/material";

export const FormMSP = () => {
    const { t } = useTranslation();
    const { theme, mode } = useZTheme();
    const { createAnewBrandMaster, editBrandMaster, listAllBrands, uploadBrandLogo } = useBrandMasterResources();
    const { role, idBrand: userIdBrand } = useZUserProfile();
    const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        activeStep,
        setActiveStep,
        setEnterOnEditing,
        companyName,
        setCompanyName,
        cnpj,
        setCnpj,
        contactEmail,
        setContactEmail,
        phone,
        setPhone,
        mspDomain,
        setMSPDomain,
        admName,
        admEmail,
        admPassword,
        admPhone,
        resetAll,
        isEditing,
        setIsEditing,
        locality,
        setLocality,
        sector,
        setSector,
        isPoc,
        setIsPoc,
        setModalOpen,
        setMspList,
        cep,
        setCep,
        countryState,
        setCountryState,
        city,
        setCity,
        street,
        setStreet,
        streetNumber,
        setStreetNumber,
        brandObjectName,
        cityCode,
        district,
        setDistrict,
        timezone,
        setTimezone,
        setShowCepError,
        showCepError,
        brandLogoUrl,
        minConsumption,
        setMinConsumption,
        discountPercentage,
        setDiscountPercentage,
    } = useZMspRegisterPage();

    const isEditMode = isEditing.length > 0;
    const editingId = isEditMode ? isEditing[0] : null;

    const canViewUpload = role === "admin" && (!isEditMode || userIdBrand === null || userIdBrand === editingId);

    const validateStepOne = () => {
        if (!companyName || !locality || !cnpj || !sector || !contactEmail) {
            toast.error(t("mspRegister.alertFieldsRequired"));
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            toast.error(t("mspRegister.invalidEmail"));
            return false;
        }

        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        const cleanCnpj = cnpj.replace(/\D/g, "");
        if (cleanCnpj.length !== 14 && !cnpjRegex.test(cnpj)) {
            toast.error(t("mspRegister.invalidCnpj"));
            return false;
        }

        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 10 && !phoneRegex.test(phone)) {
            toast.error(t("mspRegister.invalidPhone"));
            return false;
        }

        if (isNaN(Number(minConsumption)) || Number(minConsumption) < 0) {
            toast.error(t("mspRegister.invalidMinConsumption"));
            return false;
        }

        if (isNaN(Number(discountPercentage)) || Number(discountPercentage) < 0 || Number(discountPercentage) > 100) {
            toast.error(t("mspRegister.invalidDiscountPercentage"));
            return false;
        }

        return true;
    };

    const handleConfirm = async () => {
        let response;
        if (isEditMode) {
            const mspId = isEditing[0];
            response = await editBrandMaster(mspId, {
                brandName: companyName,
                emailContact: contactEmail,
                cnpj,
                setorName: sector,
                location: locality,
                state: countryState,
                city,
                cep,
                street,
                placeNumber: streetNumber,
                smsContact: phone,
                brandLogo: brandObjectName,
                cityCode: cityCode ? parseInt(cityCode) : undefined,
                district,
                isPoc,
            });

            if (response && !response.error && selectedLogoFile) {
                await uploadBrandLogo(Number(mspId), selectedLogoFile);
            }

            if (response && !response.error) {
                setModalOpen("editedMsp");
            }
        } else {
            response = await createAnewBrandMaster({
                companyName,
                cnpj,
                phone,
                sector,
                contactEmail,
                cep,
                locality,
                countryState,
                city,
                street,
                streetNumber,
                admName,
                admEmail,
                admPhone,
                admPassword,
                brandLogo: "",
                position: "admin",
                mspDomain,
                cityCode: cityCode ? parseInt(cityCode) : undefined,
                district,
                isPoc,
            });

            if (response?.brandMaster && !response.error) {
                if (selectedLogoFile) {
                    await uploadBrandLogo(response.brandMaster.idBrandMaster, selectedLogoFile);
                }
                setModalOpen("createdMsp");
            }
        }

        if (response && !response.error) {
            const updatedList = await listAllBrands();
            setMspList(updatedList.result);
            setEnterOnEditing(false);
            resetAll();
            setIsEditing([]);
            setSelectedLogoFile(null);
            setLogoPreviewUrl(null);
        }
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (validateStepOne()) {
                setActiveStep(1);
            }
        } else {
            handleConfirm();
        }
    };

    const handleBack = () => {
        if (activeStep === 1) {
            setActiveStep(0);
        } else {
            setEnterOnEditing(false);
            resetAll();
            setIsEditing([]);
        }
    };

    useEffect(() => {
        const fetchCep = async () => {
            const cleanCep = cep.replace(/\D/g, "");
            if (cleanCep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        setStreet(data.logradouro);
                        setDistrict(data.bairro);
                        setCity(data.localidade);
                        setCountryState(data.uf);
                        setShowCepError(false);
                    } else {
                        setShowCepError(true);
                        toast.error(t("mspRegister.invalidCep"));
                    }
                } catch (error) {
                    console.error("Error fetching CEP:", error);
                }
            }
        };

        if (cep.length === 8 || cep.length === 9) {
            fetchCep();
        }
    }, [cep, setStreet, setDistrict, setCity, setCountryState, setShowCepError, t]);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setSelectedLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] },
        maxSize: 50 * 1024 * 1024, // Limita para 50MB
        noClick: true,
    });

    const handleTriggerUpload = () => {
        open();
    };

    const handleRemoveLogo = () => {
        setSelectedLogoFile(null);
        setLogoPreviewUrl(null);
    };

    return (
        <Stack sx={{ width: "100%", gap: "24px" }}>
            {activeStep === 0 ? (
                <Stack sx={{ gap: "24px" }}>
                    <TextRob18Font2M sx={{ color: theme[mode].black }}>
                        {t("mspRegister.companyInfos")}
                    </TextRob18Font2M>

                    <Box sx={{
                        maxWidth: { xs: "100%", md: "80%" }
                    }}>
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr  1fr 1fr" },
                            gap: "16px"
                        }}>
                            <LabelInput
                                label={`${t("mspRegister.companyName")} ${t("mspRegister.required")}`}
                                value={companyName}
                                onChange={setCompanyName}
                                placeholder={t("mspRegister.companyNamePlaceholder")}
                                showEditIcon={isEditMode}
                            />
                            <LabelInput
                                label={`${t("mspRegister.location")} ${t("mspRegister.required")}`}
                                value={locality}
                                onChange={setLocality}
                                placeholder={t("mspRegister.locationPlaceholder")}
                                showEditIcon={isEditMode}
                            />
                            <LabelInput
                                label={`${t("mspRegister.cnpj")} ${t("mspRegister.required")}`}
                                value={cnpj}
                                onChange={setCnpj}
                                placeholder={t("mspRegister.cnpjPlaceholder")}
                                showEditIcon={isEditMode}
                            />
                            <LabelInput
                                label={t("mspRegister.phone")}
                                value={phone}
                                onChange={setPhone}
                                placeholder={t("mspRegister.phonePlaceholder")}
                                showEditIcon={isEditMode}
                            />
                            <LabelInput
                                label={`${t("mspRegister.sector")} ${t("mspRegister.required")}`}
                                value={sector}
                                onChange={setSector}
                                placeholder={t("mspRegister.sectorPlaceholder")}
                                showEditIcon={isEditMode}
                            />
                            <LabelInput
                                label={`${t("mspRegister.contactEmail")} ${t("mspRegister.required")}`}
                                value={contactEmail}
                                onChange={setContactEmail}
                                placeholder={t("mspRegister.contactEmailPlaceholder")}
                                showEditIcon={isEditMode}
                            />
                        </Box>
                    </Box>
                    <Divider sx={{ borderColor: theme[mode].grayLight }} />
                    <Box sx={{
                        maxWidth: { xs: "100%", md: "80%" }
                    }}>
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                            gap: "16px",
                            alignItems: "start"
                        }}>
                            <LabelInput
                                label={t("mspRegister.minConsumption")}
                                value={minConsumption}
                                onChange={setMinConsumption}
                                placeholder="0"
                            />
                            <LabelInput
                                label={t("mspRegister.discountPercentage")}
                                value={discountPercentage}
                                onChange={setDiscountPercentage}
                                placeholder="0"
                                suffix="%"
                            />
                            <Box sx={{
                                mt: "40px"
                            }}>
                                <CheckboxLabel
                                    label={t("mspRegister.isPoc")}
                                    value={isPoc}
                                    onChange={setIsPoc}
                                    disabled={isEditMode}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            ) : (
                <Stack sx={{ gap: "24px" }}>
                    <Stack sx={{ gap: "8px" }}>
                        <TextRob18Font2M sx={{ color: theme[mode].black }}>
                            {t("mspRegister.domain")}
                        </TextRob18Font2M>
                        <Box sx={{
                            maxWidth: { xs: "100%", md: "80%" }
                        }}>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr  1fr 1fr" },
                                gap: "16px"
                            }}>
                                <LabelInput
                                    label={`${t("mspRegister.mspDomain")} ${t("mspRegister.required")}`}
                                    value={mspDomain}
                                    onChange={setMSPDomain}
                                    placeholder={t("mspRegister.mspDomainPlaceholder")}
                                    showEditIcon={isEditMode}
                                />
                                <LabelInput
                                    label={t("mspRegister.timezone")}
                                    value={timezone}
                                    onChange={setTimezone}
                                    placeholder={t("mspRegister.timezonePlaceholder")}
                                    showEditIcon={isEditMode}
                                />
                            </Box>
                        </Box>
                    </Stack>

                    <Stack sx={{ gap: "16px" }}>
                        <TextRob18Font2M sx={{ color: theme[mode].black }}>
                            {t("mspRegister.address")}
                        </TextRob18Font2M>

                        <Box sx={{
                            maxWidth: { xs: "100%", md: "80%" }
                        }}>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                                gap: "16px",
                                alignItems: "start"
                            }}>
                                <LabelInput
                                    label={`${t("mspRegister.cep")}`}
                                    value={cep}
                                    onChange={setCep}
                                    placeholder={t("mspRegister.cepPlaceholder")}
                                    showEditIcon={isEditMode}
                                    sx={showCepError ? { border: `1px solid ${theme[mode].danger}`, borderRadius: "12px" } : {}}
                                />
                                <LabelInput
                                    label={`${t("mspRegister.countryState")}`}
                                    value={countryState}
                                    onChange={() => { }}
                                    placeholder={t("mspRegister.statePlaceholder")}
                                    disabled={true}
                                />
                                <LabelInput
                                    label={`${t("mspRegister.city")}`}
                                    value={city}
                                    onChange={() => { }}
                                    placeholder={t("mspRegister.cityPlaceholder")}
                                    disabled={true}
                                />
                            </Box>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                                gap: "16px",
                                alignItems: "start",
                                mt: 3
                            }}>
                                <LabelInput
                                    label={`${t("mspRegister.street")}`}
                                    value={street}
                                    onChange={() => { }}
                                    placeholder={t("mspRegister.streetPlaceholder")}
                                    disabled={true}
                                />
                                <LabelInput
                                    label={`${t("mspRegister.district")}`}
                                    value={district}
                                    onChange={() => { }}
                                    placeholder={t("mspRegister.districtPlaceholder")}
                                    disabled={true}
                                />
                                <LabelInput
                                    label={`${t("mspRegister.placeNumber")}`}
                                    value={streetNumber}
                                    onChange={setStreetNumber}
                                    placeholder={t("mspRegister.placeNumberPlaceholder")}
                                    showEditIcon={isEditMode}
                                />
                            </Box>
                        </Box>
                    </Stack>

                    {canViewUpload && (
                        <>
                            <Divider sx={{ borderColor: theme[mode].grayLight }} />

                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "24px", mt: 1 }}>
                                <Box
                                    {...getRootProps()}
                                    onClick={handleTriggerUpload}
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
                                        background: isDragActive
                                            ? theme[mode].grayLight
                                            : theme[mode].lightV2,
                                        cursor: "pointer",
                                    }}
                                >
                                    <input {...getInputProps()} />
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
                                        {t("whiteLabel.clickHere")}
                                    </TextRob12Font2Xs>
                                </Box>

                                {(logoPreviewUrl || brandLogoUrl) && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <img
                                            src={logoPreviewUrl || brandLogoUrl}
                                            alt="Brand logo"
                                            style={{
                                                maxWidth: "165px",
                                                maxHeight: "100px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </Box>
                                )}

                                <Stack sx={{ gap: "32px" }}>
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
                                            onClick={handleTriggerUpload}
                                        >
                                            {t("mspRegister.changeLogo")}
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
                                            onClick={handleRemoveLogo}
                                        >
                                            {t("mspRegister.removeLogo")}
                                        </Button>
                                    </Stack>

                                    <Stack
                                        sx={{
                                            gap: "8px",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                                            <CircleIcon color={theme[mode].blueDark} />
                                            <TextRob14Font1Xs sx={{ color: theme[mode].gray, fontWeight: "400", fontSize: "14px" }}>
                                                {t("whiteLabel.defaultSize")}
                                            </TextRob14Font1Xs>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                                            <CircleIcon color={theme[mode].blueDark} />
                                            <TextRob14Font1Xs sx={{ color: theme[mode].gray, fontWeight: "400", fontSize: "14px" }}>
                                                {t("whiteLabel.maxSize")}
                                            </TextRob14Font1Xs>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                                            <CircleIcon color={theme[mode].blueDark} />
                                            <TextRob14Font1Xs sx={{ color: theme[mode].gray, fontWeight: "400", fontSize: "14px" }}>
                                                {t("whiteLabel.acceptedFormats")}
                                            </TextRob14Font1Xs>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Box>
                        </>
                    )}

                </Stack>
            )}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, width: "100%" }}
            >
                <Box sx={{ maxWidth: { xs: "100%", md: "80%" }, width: "100%" }}>
                    <Box sx={{
                        display: "grid",
                        margin: "10px 0",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                        gap: "16px",
                        alignItems: "start"
                    }}>
                        <Btn
                            onClick={handleNext}
                            sx={{
                                padding: "10px 40px",
                                borderRadius: "10px",
                                backgroundColor: theme[mode].blue,
                                minWidth: "150px",
                                flex: { xs: 1, sm: "initial" }
                            }}
                        >
                            <TextRob16Font1S sx={{ color: theme[mode].btnText }}>
                                {activeStep === 0 ? t("mspRegister.continue") : t("mspRegister.confirm")}
                            </TextRob16Font1S>
                        </Btn>
                        <Btn
                            onClick={handleBack}
                            sx={{
                                padding: "10px 40px",
                                borderRadius: "10px",
                                border: `1px solid ${theme[mode].blue}`,
                                backgroundColor: "transparent",
                                minWidth: "100px",
                                flex: { xs: 1, sm: "initial" }
                            }}
                        >
                            <TextRob16Font1S sx={{ color: theme[mode].blue }}>
                                {activeStep === 0 ? t("mspRegister.cancel") : t("mspRegister.back")}
                            </TextRob16Font1S>
                        </Btn>
                    </Box>
                </Box>
                {activeStep === 1 && (
                    <Typography
                        onClick={resetAll}
                        sx={{
                            color: theme[mode].gray,
                            cursor: "pointer",
                            fontWeight: "500",
                            "&:hover": { color: theme[mode].primary },
                            mr: "16px"
                        }}
                    >
                        {t("mspRegister.clear")}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
};