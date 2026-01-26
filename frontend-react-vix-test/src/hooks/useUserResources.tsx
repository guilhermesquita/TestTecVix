import { useState } from "react";
import { TRole, useZUserProfile } from "../stores/useZUserProfile";
import { useAuth } from "./useAuth";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export interface IUserDB {
  idUser: string;
  idBrandMaster: number | null;
  username: string;
  email: string;
  profileImgUrl: null | string;
  role: "admin" | "manager" | "member";
  isActive: boolean;
  socketId: string | null;
  lastLoginDate: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  brandMaster?: {
    brandName: string;
    brandLogo: string;
  };
}

interface ICreateNewUser {
  username: string;
  email: string;
  role: TRole;
  password?: string;
  idBrandMaster?: number;
  isActive?: boolean;
}

interface IUpdateUser {
  username?: string;
  email?: string;
  role?: TRole;
  password?: string;
  idBrandMaster?: number;
  isActive?: boolean;
}

export const useUserResources = () => {
  const { idUser: currentUserId, setUser, role, idBrand } = useZUserProfile();
  const { getAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const updateUser = async (idUser: string, data: IUpdateUser) => {
    if (idUser !== currentUserId && role !== "admin" && role !== "manager")
      return null;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<IUserDB>({
      url: `/users/${idUser}`,
      auth,
      data,
    });
    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("colaboratorRegister.forbiddenMspError"));
      } else {
        toast.error(response.message);
      }
      return null;
    }
    toast.success(t("colaboratorRegister.userUpdatedSuccess"));
    return response.data;
  };

  const listUsers = async (params: Record<string, any> = {}) => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<{
      totalCount: number;
      result: IUserDB[];
    }>({
      url: "/users",
      auth,
      params,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return { totalCount: 0, result: [] };
    }
    return response.data;
  };


  const changeUserStatus = async (idUser: string) => {
    if (role !== "admin" && role !== "manager") return null;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<{ message: string }>({
      url: `/users/change-status/${idUser}`,
      auth,
    });
    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("colaboratorRegister.forbiddenMspError"));
      } else {
        toast.error(response.message);
      }
      return null;
    }
    toast.success(response.data.message);
    return response.data;
  };

  const deleteUser = async (idUser: string) => {
    if (role !== "admin") return null;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.delete<IUserDB>({
      url: `/users/${idUser}`,
      auth,
    });
    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("colaboratorRegister.forbiddenMspError"));
      } else {
        toast.error(response.message);
      }
      return null;
    }
    toast.success(t("colaboratorRegister.userDeletedSuccess"));
    return response.data;
  };

  const createUser = async (data: ICreateNewUser) => {
    if (role !== "admin" && role !== "manager") return null;
    const idBrandMaster = idBrand;
    if (!idBrandMaster && role !== "admin") {
      toast.error(t("generic.errorToSaveData"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.post({
      url: "/users",
      auth,
      data: {
        ...data,
        idBrandMaster: data.idBrandMaster || idBrandMaster,
      },
    });
    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("colaboratorRegister.forbiddenMspError"));
      } else {
        toast.error(response.message);
      }
      return null;
    }
    toast.success(t("colaboratorRegister.userCreatedSuccess"));
    return response.data;
  };

  const uploadUserImage = async (idUser: string, file: File) => {
    if (!idUser || !file) return null;
    const auth = await getAuth();
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    const response = await api.put<IUserDB>({
      url: `/users/${idUser}/image`,
      auth: {
        ...auth,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return null;
    }

    if (idUser === currentUserId && response.data.profileImgUrl) {
      setUser({ profileImgUrl: response.data.profileImgUrl });
    }

    return response.data;
  };

  return {
    isLoading,
    listUsers,
    updateUser,
    changeUserStatus,
    deleteUser,
    createUser,
    uploadUserImage,
  };
};
