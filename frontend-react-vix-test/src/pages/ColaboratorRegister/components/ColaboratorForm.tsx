import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { LabelInput } from "../../../components/Inputs/LabelInputs";
import { DropDrownLabel } from "../../../components/Inputs/DropDrownLabel";
import { useZColaboratorRegisterPage } from "../../../stores/useZColaboratorRegisterPage";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";
import { useEffect, useMemo } from "react";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { useUserResources } from "../../../hooks/useUserResources";
import { toast } from "react-toastify";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { TRole } from "../../../stores/useZUserProfile";

export const ColaboratorForm = () => {
    const { t } = useTranslation();
    const { theme, mode } = useZTheme();
    const { mspList, setMspList } = useZMspRegisterPage();
    const { listAllBrands } = useBrandMasterResources();
    const { createUser, updateUser, listUsers: refreshUserList } = useUserResources();
    const {
        fullName, setFullName,
        email, setEmail,
        phone, setPhone,
        username, setUsername,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        position, setPosition,
        department, setDepartment,
        role, setRole,
        hiringDate, setHiringDate,
        isActive, setIsActive,
        idBrandMaster, setIdBrandMaster,
        resetAll, setUserList,
        isEditing,
    } = useZColaboratorRegisterPage();

    useEffect(() => {
        const fetchBrands = async () => {
            const brands = await listAllBrands();
            if (brands) setMspList(brands.result);
        };
        fetchBrands();
    }, []);

    const brandOptions = useMemo(() => {
        return (mspList || []).map(msp => ({
            label: msp.brandName || "",
            value: msp.idBrandMaster
        }));
    }, [mspList]);

    const roleOptions = [
        { label: t("colaboratorRegister.admin"), value: "admin" },
        { label: t("colaboratorRegister.manager"), value: "manager" },
        { label: t("colaboratorRegister.member"), value: "member" },
    ];

    const statusOptions = [
        { label: t("colaboratorRegister.active"), value: true },
        { label: t("colaboratorRegister.inactive"), value: false },
    ];

    const handleSave = async () => {
        if (!email || !username || (!isEditing.length && !password) || !role) {
            toast.error(t("colaboratorRegister.alertMessage"));
            return;
        }

        if (!isEditing.length && password !== confirmPassword) {
            toast.error(t("colaboratorRegister.dontMatch"));
            return;
        }

        const data: any = {
            username,
            email,
            role,
            isActive,
            idBrandMaster: idBrandMaster || undefined,
        };

        if (password) {
            data.password = password;
        }

        let result;
        if (isEditing.length > 0) {
            result = await updateUser(isEditing[0], data);
        } else {
            result = await createUser(data);
        }

        if (result) {
            const users = await refreshUserList();
            setUserList(users.result);
            resetAll();
        }
    };

    return (
        <Stack
            sx={{
                background: theme[mode].lightV2,
                borderRadius: "16px",
                padding: "32px",
                gap: "32px",
            }}
        >
            <TextRob16Font1S sx={{ color: theme[mode].black, fontWeight: "500" }}>
                {t("colaboratorRegister.subtitle")}
            </TextRob16Font1S>
            <Box sx={{
                maxWidth: { xs: "100%", md: "80%" }
            }}>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr  1fr 1fr" },
                    gap: "16px"
                }}>
                    <LabelInput
                        label={`${t("colaboratorRegister.completeName")} ${t("colaboratorRegister.required")}`}
                        placeholder={t("colaboratorRegister.completeNamePlaceholder")}
                        value={fullName}
                        onChange={setFullName}
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={`${t("colaboratorRegister.email")} ${t("colaboratorRegister.required")}`}
                        placeholder={t("colaboratorRegister.emailPlaceholder")}
                        value={email}
                        onChange={setEmail}
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={t("colaboratorRegister.phone")}
                        placeholder="(00) 0 0000-0000"
                        value={phone}
                        onChange={setPhone}
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={`${t("colaboratorRegister.username")} ${t("colaboratorRegister.required")}`}
                        placeholder={t("colaboratorRegister.username")}
                        value={username}
                        onChange={setUsername}
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={`${t("colaboratorRegister.password")} ${t("colaboratorRegister.required")}`}
                        placeholder={t("colaboratorRegister.password")}
                        value={password}
                        onChange={setPassword}
                        type="password"
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={t("colaboratorRegister.confirmPassword")}
                        placeholder={t("colaboratorRegister.confirmPassword")}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        type="password"
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={`${t("colaboratorRegister.position")} ${t("colaboratorRegister.required")}`}
                        placeholder={t("colaboratorRegister.positionPlaceholder")}
                        value={position}
                        onChange={setPosition}
                        showEditIcon={isEditing.length > 0}
                    />
                    <LabelInput
                        label={t("colaboratorRegister.department")}
                        placeholder={t("colaboratorRegister.departmentPlaceholder")}
                        value={department}
                        onChange={setDepartment}
                        showEditIcon={isEditing.length > 0}
                    />
                    <DropDrownLabel
                        label={`${t("colaboratorRegister.permission")} ${t("colaboratorRegister.required")}`}
                        data={roleOptions}
                        value={roleOptions.find(o => o.value === role) || null}
                        onChange={(val) => setRole(val?.value as TRole)}
                    />
                    <LabelInput
                        label={t("colaboratorRegister.hiringDate")}
                        placeholder="01/01/2025"
                        value={hiringDate}
                        onChange={setHiringDate}
                        showEditIcon={isEditing.length > 0}
                    />
                    <DropDrownLabel
                        label={`${t("colaboratorRegister.status")} ${t("colaboratorRegister.required")}`}
                        data={statusOptions}
                        value={statusOptions.find(o => o.value === isActive) || null}
                        onChange={(val) => setIsActive(val?.value as boolean)}
                    />
                    <DropDrownLabel
                        label={t("colaboratorRegister.companyName")}
                        data={brandOptions}
                        value={brandOptions.find(o => o.value === idBrandMaster) || null}
                        onChange={(val) => setIdBrandMaster(val?.value as number)}
                        disabled={isEditing.length > 0}
                    />
                </Box>
            </Box>

            <Box sx={{ maxWidth: { xs: "100%", md: "80%" }, width: "100%" }}>
                <Box sx={{
                    display: "grid",
                    margin: "10px 0",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
                    gap: "16px",
                    alignItems: "start"
                }}>
                    <Btn
                        onClick={handleSave}
                        sx={{
                            padding: "10px 40px",
                            borderRadius: "10px",
                            backgroundColor: theme[mode].blue,
                            minWidth: "150px",
                            flex: { xs: 1, sm: "initial" }
                        }}
                    >
                        <TextRob16Font1S sx={{ color: theme[mode].btnText }}>
                            {t("colaboratorRegister.save")}
                        </TextRob16Font1S>
                    </Btn>
                    <Btn
                        onClick={resetAll}
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
                            {t("colaboratorRegister.clear")}
                        </TextRob16Font1S>
                    </Btn>
                </Box>
            </Box>
        </Stack>
    );
};
