import { Avatar, Box, IconButton, Stack, } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { useZColaboratorRegisterPage } from "../../../stores/useZColaboratorRegisterPage";
import { useUserResources, IUserDB } from "../../../hooks/useUserResources";
import { useZUserProfile } from "../../../stores/useZUserProfile";
import { Fragment, useEffect, useMemo, useState } from "react";
import { PencilCicleIcon } from "../../../icons/PencilCicleIcon";
import { toast } from "react-toastify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { TextRob16Font1S } from "../../../components/Text1S";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { DropDrownLabel } from "../../../components/Inputs/DropDrownLabel";
import { FilterInput } from "../../../components/Inputs/FilterInput";
import { FilterIcon } from "../../../icons/FilterIcon";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import moment from "moment";
import { ModalSimple } from "../../../components/Modal/ModalSimple";
import { Btn } from "../../../components/Buttons/Btn";

export const ColaboratorTable = () => {
    const { t } = useTranslation();
    const { theme, mode } = useZTheme();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<IUserDB | null>(null);
    const {
        idUser: loggedInUserId,
        role: loggedInUserRole,
        idBrand: loggedInUserBrandId
    } = useZUserProfile();
    const { listUsers, deleteUser, changeUserStatus } = useUserResources();
    const { mspList } = useZMspRegisterPage();
    const {
        userList, setUserList,
        userTableFilter, setUserTableFilter,
        brandNameFilter, setBrandNameFilter,
        companyFilter, setCompanyFilter,
        roleFilter, setRoleFilter,
        setIsEditing, setEmail, setUsername, setRole, setIsActive, setIdBrandMaster,
    } = useZColaboratorRegisterPage();

    const canManageUser = (user: IUserDB) => {
        // Members cannot delete anyone
        if (loggedInUserRole === "member") return false;

        // Only admins can delete
        if (loggedInUserRole !== "admin") return false;

        // Cannot delete yourself
        const isSelf = user.idUser === loggedInUserId;
        if (isSelf) return false;

        // Platform-level admins (null brand) can delete all users
        if (loggedInUserBrandId === null) return true;

        // Brand-level admins can only delete users from their same brand
        const isSameBrand = user.idBrandMaster === loggedInUserBrandId;
        return isSameBrand;
    };

    const canEditUser = (user: IUserDB) => {
        // Members cannot edit anyone
        if (loggedInUserRole === "member") return false;

        // Only admins and managers can edit
        if (loggedInUserRole !== "admin" && loggedInUserRole !== "manager") return false;

        // Platform-level users (null brand) can edit all users
        if (loggedInUserBrandId === null) return true;

        // Brand-level users can only edit users from their same brand
        const isSameBrand = user.idBrandMaster === loggedInUserBrandId;
        return isSameBrand;
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const params: Record<string, any> = {};
            if (userTableFilter) params.username = userTableFilter;
            if (brandNameFilter) params.nameBrandMaster = brandNameFilter;
            if (companyFilter !== "all") params.idBrandMaster = companyFilter;
            if (roleFilter !== "all") params.role = roleFilter;

            const result = await listUsers(params);
            if (result) setUserList(result.result);
        };

        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [userTableFilter, brandNameFilter, companyFilter, roleFilter]);

    const companyOptions = useMemo(() => {
        const options = (mspList || []).map(msp => ({
            label: msp.brandName || "",
            value: msp.idBrandMaster
        }));
        return [{ label: t("colaboratorRegister.companyFilterPlaceholder"), value: "all" }, ...options];
    }, [mspList, t]);

    const roleOptions = [
        { label: t("colaboratorRegister.UserFilterPlaceholder"), value: "all" },
        { label: t("colaboratorRegister.admin"), value: "admin" },
        { label: t("colaboratorRegister.manager"), value: "manager" },
        { label: t("colaboratorRegister.member"), value: "member" },
    ];

    const filteredUsers = userList;

    const handleEdit = (user: IUserDB) => {
        if (!canEditUser(user)) {
            toast.error(t("generic.errorOlnlyAdmin"));
            return;
        }
        setIsEditing([user.idUser]);
        setEmail(user.email);
        setUsername(user.username);
        setRole(user.role);
        setIsActive(user.isActive);
        setIdBrandMaster(user.idBrandMaster);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (idUser: string) => {
        const user = userList.find(u => u.idUser === idUser);
        if (!user || !canManageUser(user)) {
            toast.warning(t("colaboratorRegister.cannotDeactivateSelf"));
            return;
        }
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        const result = await deleteUser(userToDelete.idUser);
        if (result) {
            const refreshed = await listUsers();
            if (refreshed) setUserList(refreshed.result);
        }
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleToggleStatus = async (idUser: string) => {
        const user = userList.find(u => u.idUser === idUser);
        if (!user || !canManageUser(user)) {
            toast.warning(t("colaboratorRegister.cannotDeactivateSelf"));
            return;
        }
        const result = await changeUserStatus(idUser);
        if (result) {
            const refreshed = await listUsers();
            if (refreshed) setUserList(refreshed.result);
        }
    };

    return (
        <Stack sx={{
            gap: "24px",
            mt: "40px",
            background: theme[mode].mainBackground,
            borderRadius: "16px",
            padding: "24px",
        }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                }}
            >
                <TextRob16Font1S sx={{ color: theme[mode].black, fontWeight: "500" }}>
                    {t("colaboratorRegister.tableTitle")}
                </TextRob16Font1S>

                <Stack direction="row" gap="25px" sx={{ flexWrap: "wrap", width: { xs: "100%", md: "auto" } }}>
                    <Box>
                        <FilterInput
                            icon={<FilterIcon fill={theme[mode].gray} />}
                            value={userTableFilter}
                            onChange={setUserTableFilter}
                            placeholder={t("colaboratorRegister.UserFilterPlaceholder")}
                        />
                    </Box>
                    <Box>
                        <FilterInput
                            icon={<FilterIcon fill={theme[mode].gray} />}
                            value={brandNameFilter}
                            onChange={setBrandNameFilter}
                            placeholder={t("colaboratorRegister.companyFilterPlaceholder")}
                        />
                    </Box>
                </Stack>
            </Box>

            <Stack sx={{
                width: "100%",
                gap: "12px",
            }}>
                {filteredUsers.map((user, index) => (
                    <Fragment key={user.idUser}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                gap: "16px",
                                "@media (max-width: 800px)": {
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                },
                            }}
                        >
                            {/* User Info */}
                            <Box sx={{ flex: "2", display: "flex", flexDirection: "row", gap: "16px", alignItems: "center" }}>
                                <Avatar src={user.profileImgUrl || ""} sx={{ width: 36, height: 36 }} />
                                <Stack>
                                    <TextRob14Font1Xs sx={{ color: theme[mode].black, fontWeight: 500 }}>
                                        {user.username}
                                    </TextRob14Font1Xs>
                                    <TextRob12Font2Xs sx={{ color: theme[mode].gray, fontWeight: 400 }}>
                                        {user.email}
                                    </TextRob12Font2Xs>
                                </Stack>
                            </Box>

                            {/* Status and activity */}
                            <Stack sx={{
                                flex: "2",
                                "@media (max-width: 900px)": { display: "none" }
                            }}>
                                <TextRob14Font1Xs sx={{ color: theme[mode].black, fontWeight: 500 }}>
                                    {t("colaboratorRegister.status")}
                                </TextRob14Font1Xs>
                                <TextRob12Font2Xs sx={{ color: theme[mode].gray, fontWeight: 400 }}>
                                    {t("colaboratorRegister.lastActivity")} {user.lastLoginDate ? moment(user.lastLoginDate).format("DD/MM/YYYY") : t("colaboratorRegister.noActivity")}
                                </TextRob12Font2Xs>
                            </Stack>

                            {/* Badges / Roles Container */}
                            <Box sx={{
                                flex: "1",
                                display: "flex",
                                justifyContent: "flex-end",
                                "@media (max-width: 800px)": { justifyContent: "flex-start" }
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                    alignItems: "center",
                                    justifyContent: "flex-start"
                                }}>
                                    <TextRob14Font1Xs sx={{
                                        boxSizing: "content-box",
                                        padding: "0 10px",
                                        fontWeight: "400",
                                        borderRadius: "12px",
                                        border: `1px solid ${theme[mode].blueMedium}`,
                                        color: theme[mode].blueMedium,
                                    }}>
                                        {t("colaboratorRegister." + user.role)}
                                    </TextRob14Font1Xs>

                                    <TextRob14Font1Xs sx={{
                                        boxSizing: "content-box",
                                        padding: "0 10px",
                                        fontWeight: "400",
                                        borderRadius: "12px",
                                        border: `1px solid ${theme[mode].tertiary}`,
                                        color: theme[mode].tertiary,
                                    }}>
                                        {user.brandMaster?.brandName || "Vituax"}
                                    </TextRob14Font1Xs>

                                    <TextRob14Font1Xs
                                        onClick={() => handleToggleStatus(user.idUser)}
                                        sx={{
                                            boxSizing: "content-box",
                                            padding: "0 10px",
                                            fontWeight: "400",
                                            borderRadius: "12px",
                                            border: `1px solid ${user.isActive ? theme[mode].ok : theme[mode].danger}`,
                                            color: user.isActive ? theme[mode].ok : theme[mode].danger,
                                            cursor: canManageUser(user) ? "pointer" : "not-allowed",
                                            "&:hover": { opacity: canManageUser(user) ? 0.8 : 1 }
                                        }}
                                    >
                                        {t(`colaboratorRegister.${user.isActive ? "active" : "inactive"}`)}
                                    </TextRob14Font1Xs>
                                </Box>
                            </Box>

                            {/* Actions */}
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "8px",
                                alignItems: "center",
                                ml: "16px",
                                minWidth: "96px", // Reserve space for 2 icons (40px each + 8px gap + padding)
                                justifyContent: "flex-start"
                            }}>
                                {canEditUser(user) && (
                                    <IconButton
                                        onClick={() => handleEdit(user)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <PencilCicleIcon fill={theme[mode].blueMedium} />
                                    </IconButton>
                                )}
                                {canManageUser(user) && (
                                    <IconButton
                                        onClick={() => handleDeleteClick(user.idUser)}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        <DeleteForeverIcon sx={{ color: theme[mode].danger }} />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>

                        {index !== filteredUsers.length - 1 && (
                            <div style={{
                                height: "1px",
                                width: "100%",
                                background: theme[mode].grayLight,
                            }} />
                        )}
                    </Fragment>
                ))}
            </Stack>

            <ModalSimple
                open={deleteModalOpen}
                onClose={handleCancelDelete}
                sx={{ maxWidth: "500px", width: "90%" }}
                title={
                    <TextRob16Font1S sx={{ color: theme[mode].black, fontWeight: "600" }}>
                        {t("colaboratorRegister.confirmDelete")}
                    </TextRob16Font1S>
                }
                content={
                    <Stack sx={{ gap: "24px", pt: "16px" }}>
                        <TextRob14Font1Xs sx={{ color: theme[mode].gray }}>
                            {t("colaboratorRegister.deleteMessage", { username: userToDelete?.username || "" })}
                        </TextRob14Font1Xs>
                        <Stack direction="row" gap="16px" justifyContent="flex-end">
                            <Btn
                                onClick={handleCancelDelete}
                                sx={{
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    border: `1px solid ${theme[mode].gray}`,
                                    backgroundColor: "transparent",
                                }}
                            >
                                <TextRob14Font1Xs sx={{ color: theme[mode].gray }}>
                                    {t("colaboratorRegister.cancel")}
                                </TextRob14Font1Xs>
                            </Btn>
                            <Btn
                                onClick={handleConfirmDelete}
                                sx={{
                                    padding: "10px 24px",
                                    borderRadius: "8px",
                                    backgroundColor: theme[mode].danger,
                                }}
                            >
                                <TextRob14Font1Xs sx={{ color: theme[mode].btnText }}>
                                    {t("colaboratorRegister.delete")}
                                </TextRob14Font1Xs>
                            </Btn>
                        </Stack>
                    </Stack>
                }
            />
        </Stack>
    );
};
