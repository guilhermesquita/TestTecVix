import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useZUserProfile } from "../stores/useZUserProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { passwordRegex, validatePassword } from "../utils/genStrongPass";
import { MIN_PASS_SIZE } from "../configs/contants";

import {
  ENetworkType,
  IVMCreatedResponse,
  IVMResource,
} from "../types/VMTypes";
import { EOS } from "../stores/useZVMSugestion";

enum ETaskLocation {
  BRAZIL_SOUTH = "BRAZIL_SOUTH",
  BRAZIL_SOUTHEAST = "BRAZIL_SOUTHEAST",
  BRAZIL_NORTHEAST = "BRAZIL_NORTHEAST",
  US_EAST = "US_EAST",
  US_WEST = "US_WEST",
  EUROPE = "EUROPE",
  ASIA = "ASIA",
}

export const useVmResource = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreateVM, setIsLoadingCreateVM] = useState(false);
  const [isLoadingUpdateVM, setIsLoadingUpdateVM] = useState(false);
  const [isLoadingDeleteVM, setIsLoadingDeleteVM] = useState(false);
  const { t } = useTranslation();
  const { idBrand, role } = useZUserProfile();
  const navigate = useNavigate();
  const { getAuth } = useAuth();

  const osNotFound = {
    idVMISO: 0,
    value: EOS.notFound,
    label: t("generic.notFound"),
    hasTerminal: false,
    hasMonitor: false,
    isoLabelName: t("generic.notFound"),
    isoCode: "",
    hasDiskGraph: false,
    hasCPUGraph: false,
    hasMemoryGraph: false,
    hasNetworkGraph: false,
    hasDiskReadGraph: false,
    hasDiskWriteGraph: false,
    isActive: false,
    supplier: null,
    version: null,
    isRequiredLicense: false,
    category: null,
    priceBRL: 0,
    licenseURL: null,
    description: null,
    logoURL: null,
    imgDemo1: null,
    imgDemo2: null,
    imgDemo3: null,
    arch: null,
    cpuRequirement: null,
    ramRequirement: null,
    diskRequirement: null,
  };

  const storageOptions = [
    {
      value: "ssd",
      label: "SSD",
    },
    {
      value: "hd",
      label: "HD",
    },
  ];

  const localizationOptions: { value: ETaskLocation; label: string }[] = [
    {
      value: ETaskLocation.US_EAST,
      label: t("createVm.usaMiami"),
    },
    {
      value: ETaskLocation.US_WEST,
      label: t("createVm.usaCalifornia"),
    },
    {
      value: ETaskLocation.BRAZIL_SOUTHEAST,
      label: t("createVm.brSaoPaulo"),
    },
    {
      value: ETaskLocation.BRAZIL_SOUTH,
      label: t("createVm.brCuritiba"),
    },
    {
      value: ETaskLocation.BRAZIL_NORTHEAST,
      label: t("createVm.brRecife"),
    },
    {
      value: ETaskLocation.EUROPE,
      label: t("createVm.euFrankfurt"),
    },
    {
      value: ETaskLocation.ASIA,
      label: t("createVm.asiaSingapore"),
    },
  ];

  const networkTypeOptions: { value: ENetworkType; label: string }[] = [
    {
      value: ENetworkType.public,
      label: t("createVm.publicNetwork"),
    },
    {
      value: ENetworkType.public_private,
      label: `${t("createVm.publicNetwork")} & ${t("createVm.privateNetwork")}`,
    },
    {
      value: ENetworkType.private,
      label: t("createVm.privateNetwork"),
    },
  ];

  const validPassword = (vmPassword: string) => {
    const isValid = validatePassword(vmPassword, MIN_PASS_SIZE);
    if (isValid) return true;
    const password = vmPassword;
    switch (true) {
      case password.length < MIN_PASS_SIZE:
        toast.error(t("createVm.passwordMinLength"));
        break;
      case passwordRegex.numbers.test(password):
        toast.error(t("createVm.passwordNumberValidation"));
        break;
      case passwordRegex.lowercase.test(password):
        toast.error(t("createVm.passwordLowercaseValidation"));
        break;
      case passwordRegex.uppercase.test(password):
        toast.error(t("createVm.passwordUppercaseValidation"));
        break;
      case passwordRegex.special.test(password):
        toast.error(t("createVm.passwordSpecialValidation"));
        break;
    }
    return false;
  };

  const createVm = async (vm: IVMResource) => {
    setIsLoadingCreateVM(true);

    const auth = await getAuth();
    const response = await api.post<IVMCreatedResponse>({
      url: "/vm",
      data: {
        ...vm,
        idBrandMaster: idBrand,
      },
      auth,
    });

    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      if (response.message === "VM name already exists") {
        toast.error(t("createVm.vmNameAlreadyExists"));
      }
      setIsLoadingCreateVM(false);
      return;
    }
    toast.success(t("createVm.createVmSuccess"));
    setIsLoadingCreateVM(false);
    return navigate("/");
  };

  const updateNameVm = async ({
    idVM,
    vmName,
  }: {
    idVM: number;
    vmName: string;
  }) => {
    const auth = await getAuth();
    const response = await api.put<IVMCreatedResponse>({
      url: `/vm/${idVM}`,
      data: { vmName },
      auth,
    });
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return;
    }

    toast.success(t("createVm.updateVmSuccess"));
    return;
  };

  const updateVMStatus = async ({
    idVM,
    status,
  }: {
    idVM: number;
    status: "RUNNING" | "STOPPED" | "PAUSED";
  }) => {
    const auth = await getAuth();
    const response = await api.put<IVMCreatedResponse>({
      url: `/vm/${idVM}`,
      data: { status },
      auth,
    });
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return null;
    }

    return response.data;
  };

  const updateDiskSizeVm = async ({
    idVM,
    disk,
  }: {
    idVM: number;
    disk: number;
  }) => {
    const auth = await getAuth();
    const response = await api.put<IVMCreatedResponse>({
      url: `/vm/${idVM}`,
      data: { disk },
      auth,
    });

    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return;
    }

    toast.success(t("createVm.updateVmSuccess"));
    return;
  };

  const getVMById = async (idVM: number) => {
    setIsLoading(true);
    const auth = await getAuth();
    const response = await api.get<IVMCreatedResponse>({
      url: `/vm/${idVM}`,
      auth,
      tryRefetch: true,
    });
    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return;
    }

    return response.data;
  };

  const updateVM = async (vm: IVMResource, idVM: number) => {
    const auth = await getAuth();
    setIsLoadingUpdateVM(true);
    const [response] = await Promise.all([
      api.put<IVMCreatedResponse>({
        url: `/vm/${idVM}`,
        data: {
          ...vm,
          idBrandMaster: idBrand,
        },
        auth,
      }),
    ]);

    setIsLoadingUpdateVM(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return;
    }

    toast.success(t("createVm.updateVmSuccess"));
    return;
  };

  const deleteVM = async (idVM: number) => {
    if (role !== "admin") return toast.error(t("generic.errorOlnlyAdmin"));
    if (!idVM) return;
    setIsLoadingDeleteVM(true);
    const auth = await getAuth();
    const response = await api.delete<IVMCreatedResponse>({
      url: `/vm/${idVM}`,
      auth,
    });
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      return setIsLoadingDeleteVM(false);
    }

    return response.data;
  };

  const getOS = ({
    osLabel,
    osValue,
  }: {
    osLabel?: string;
    osValue?: string;
  }) => {
    if (osLabel) {
      return { ...osNotFound, isoLabelName: osLabel, isoCode: osValue };
    }

    if (osValue) {
      return { ...osNotFound, isoLabelName: osLabel, isoCode: osValue };
    }

    return osNotFound;
  };

  const getOSDeletedLabel = (): string => {
    return "";
  };

  const getNetworkType = ({
    networkTypeLabel,
    networkTypeValue,
  }: {
    networkTypeLabel?: string;
    networkTypeValue?: number;
  }): { value: ENetworkType; label: string } => {
    if (networkTypeLabel)
      return (
        networkTypeOptions?.find((nt) => nt.label === networkTypeLabel) ||
        networkTypeOptions[0]
      );
    if (networkTypeValue)
      return (
        networkTypeOptions?.find((nt) => nt.value === networkTypeValue) ||
        networkTypeOptions[0]
      );
    return networkTypeOptions[0];
  };

  const monitoringVMStatus = async (idVM: number) => {
    const auth = await getAuth();
    const response = await api.get<boolean>({
      url: `/vm/monitoring/status/${idVM}`,
      auth,
    });
    if (response.error) {
      toast.error(response.message);
      return false;
    }
    return Boolean(response.data);
  };

  const startVm = async (idVM: number) => {
    const auth = await getAuth();
    const response = await api.put({
      url: `/vm/${idVM}/start`,
      auth,
    });
    if (response.error) {
      toast.error(response.message);
    }
    return response;
  };

  const stopVm = async (idVM: number) => {
    const auth = await getAuth();
    const response = await api.put({
      url: `/vm/${idVM}/stop`,
      auth,
    });
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
    }
    return response;
  };

  return {
    createVm,
    updateNameVm,
    updateDiskSizeVm,
    getVMById,
    updateVM,
    validPassword,
    deleteVM,
    getOS,
    getNetworkType,
    storageOptions,
    localizationOptions,
    isLoading,
    networkTypeOptions,
    isLoadingCreateVM,
    isLoadingUpdateVM,
    isLoadingDeleteVM,
    getOSDeletedLabel,
    monitoringVMStatus,
    updateVMStatus,
    startVm,
    stopVm,
  };
};
