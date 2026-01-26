import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useTranslation } from "react-i18next";
import { useZBrandInfo } from "../stores/useZBrandStore";
import { useUploadFile } from "./useUploadFile";
import { IBrandMasterBasicInfo } from "../types/BrandMasterTypes";


interface IUpdateBrandMaster {
  brandName?: string;
  isActive?: boolean;
  brandLogo?: string;
  domain?: string;
  emailContact?: string;
  cnpj?: string;
  setorName?: string;
  location?: string;
  state?: string;
  city?: string;
  cep?: string;
  street?: string;
  placeNumber?: string;
  smsContact?: string;
  mspDomain?: string;
  admName?: string;
  admEmail?: string;
  admPhone?: string;
  admPassword?: string;
  cityCode?: number;
  district?: string;
  isPoc?: boolean;

  manual?: string;
  termsOfUse?: string;
  privacyPolicy?: string;
}

interface IBrandMasterResource {
  brandName: string;
  isActive: boolean;
  brandLogo: string;
  domain: string;
  setorName: string;
  fieldName: string;
  location: string;
  city: string;
  emailContact: string;
  smsContact: string;
  timezone: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;

  manual?: string;
  termsOfUse?: string;
  privacyPolicy?: string;
}

interface ICreateNewBrandMaster {
  companyName: string;
  cnpj: string;
  phone: string;
  sector: string;
  contactEmail: string;
  cep: string;
  locality: string;
  countryState: string;
  city: string;
  street: string;
  streetNumber: string;
  admName: string;
  admEmail: string;
  admPhone: string;
  admPassword: string;
  brandLogo: string;
  position: "admin";
  mspDomain: string;
  cityCode?: number;
  district?: string;
  isPoc?: boolean;
}

export interface INewMSPResponse {
  idBrandMaster: number;
  brandLogo: string | null;
  brandName: string | null;
  cep: null | string;
  city: string | null;
  cnpj: string | null;
  domain: string | null;
  contract: string | null;
  emailContact: string | null;
  fieldName: string | null;
  isActive: boolean;
  location: string | null;
  placeNumber: string | null;
  setorName: string | null;
  smsContact: string | null;
  state: string | null;
  street: string | null;
  timezone: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
  cityCode: number | null;
  district: string | null;
  isPoc: boolean;
  manual?: string | null;
  termsOfUse?: string | null;
  privacyPolicy?: string | null;
}

export const useBrandMasterResources = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();
  const { role, idBrand } = useZUserProfile();
  const { t } = useTranslation();
  const {
    brandName,
    setBrandInfo,
    idBrand: idBrandInfo,
    domain,
  } = useZBrandInfo();
  const { getFileByObjectName } = useUploadFile();

  const updateBrandMaster = async ({
    brandName,
    brandLogo,
    domain,
  }: IUpdateBrandMaster) => {
    if (!role || (role !== "admin" && role !== "manager")) return;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put({
      url: `/brand-master/${idBrand}`,
      auth,
      data: {
        brandName,
        brandLogo,
        domain,
      },
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(t("whiteLabel.mspUpdateSuccess"));
    return response.data;
  };

  const updateBrandMasterInfo = async (data: Partial<IBrandMasterResource>) => {
    if (data.brandName && brandName !== data.brandName && role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    if (data.domain && domain !== data.domain && role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<IBrandMasterResource>({
      url: `/brand-master/${idBrand}`,
      auth,
      data,
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    const dataResponse = response.data;
    const { url } = await getFileByObjectName(dataResponse.brandLogo);
    setBrandInfo({
      brandName: dataResponse.brandName,
      brandLogo: url || "",
      domain: dataResponse.domain || "",
      setorName: dataResponse.setorName || "",
      fieldName: dataResponse.fieldName || "",
      location: dataResponse.location || "",
      city: dataResponse.city || "",
      emailContact: dataResponse.emailContact || "",
      smsContact: dataResponse.smsContact || "",
      timezone: dataResponse.timezone || "",
      manual: dataResponse?.manual || null,
      termsOfUse: dataResponse?.termsOfUse || null,
      privacyPolicy: dataResponse?.privacyPolicy || null,
    });

    return response.data;
  };

  const createAnewBrandMaster = async (data: ICreateNewBrandMaster) => {
    if (!data) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.post<INewMSPResponse>({
      url: `/brand-master`,
      auth,
      data: {
        brandName: data.companyName,
        isActive: true,
        brandLogo: data.brandLogo,
        domain: undefined,
        setorName: data.sector,
        fieldName: undefined,
        location: data.locality,
        city: data.city,
        emailContact: data.contactEmail,
        smsContact: data.phone,
        timezone: undefined,
        state: data.countryState,
        street: data.street,
        placeNumber: data.streetNumber,
        cnpj: data.cnpj,
        cep: data.cep,
        cityCode: data?.cityCode ? data.cityCode : undefined,
        district: data?.district ? data.district : undefined,
        isPoc: Boolean(data?.isPoc),
      },
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }

    return { brandMaster: response.data };
  };

  const listAllBrands = async () => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IListAll<INewMSPResponse>>({
      url: "/brand-master",
      auth,
    });
    setIsLoading(true);

    if (response.error) {
      toast.error(response.message);

      return {
        totalCount: 0,
        result: [],
      };
    }
    return response.data;
  };

  const deleteBrandMaster = async (brandMasterId: number | string) => {
    if (!brandMasterId) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.delete<{
      brandMaster: IBrandMasterBasicInfo;
    }>({
      url: `/brand-master/${brandMasterId}`,
      auth,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    return response.data;
  };

  const editBrandMaster = async (
    brandMasterId: number | string,
    data: IUpdateBrandMaster,
  ) => {
    if (!brandMasterId) return null;
    if (!data) return null;
    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    const response = await api.put<INewMSPResponse>({
      url: `/brand-master/${brandMasterId}`,
      auth,
      data: {
        brandName: data.brandName,
        emailContact: data.emailContact,
        cnpj: data.cnpj,
        setorName: data.setorName,
        location: data.location,
        state: data.state,
        city: data.city,
        cep: data.cep,
        street: data.street,
        placeNumber: data.placeNumber,
        smsContact: data.smsContact,
        brandLogo: data.brandLogo,
        cityCode: data?.cityCode ? data.cityCode : undefined,
        district: data?.district ? data.district : undefined,
        isPoc: Boolean(data?.isPoc),
      },
    });

    if (response.error) {
      toast.error(response.message);
      return;
    }

    return {
      brandMaster: response.data,
    };
  };

  const getSelf = async () => {
    if (!idBrand) return null;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<INewMSPResponse>({
      url: `/brand-master/${idBrand}`,
      auth,
    });
    setIsLoading(true);

    if (response.error) {
      toast.error(response.message);
      return null;
    }
    return response.data;
  };

  const uploadBrandLogo = async (idBrandMaster: number, file: File) => {
    if (!idBrandMaster || !file) return null;
    const auth = await getAuth();
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    const response = await api.put<INewMSPResponse>({
      url: `/brand-master/${idBrandMaster}/logo`,
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

    return response.data;
  };

  return {
    isLoading,
    updateBrandMaster,
    updateBrandMasterInfo,
    createAnewBrandMaster,
    listAllBrands,
    deleteBrandMaster,
    editBrandMaster,
    getSelf,
    uploadBrandLogo,
  };
};