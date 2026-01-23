import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useTranslation } from "react-i18next";

export interface IMetricPoint {
  timestamp: string;
  used: number;
  usagePercent: number;
}

export interface IResourceMetrics {
  total?: number;
  totalGB?: number;
  metrics: IMetricPoint[];
}

export interface IVmMetricsResponse {
  idVM: number;
  vmName: string;
  cpu: IResourceMetrics;
  ram: IResourceMetrics;
  disk: IResourceMetrics;
}

export const useListMetricsVm = () => {
  const [metrics, setMetrics] = useState<IVmMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currentIdVM } = useZGlobalVar();
  const { getAuth } = useAuth();
  const { t } = useTranslation();

  const fetchMetrics = async (id: number) => {
    const vmId = id || currentIdVM;

    if (!vmId) return;

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IVmMetricsResponse>({
      url: `/vm/${vmId}/metrics`,
      auth,
    });

    setIsLoading(false);
    if (response.error) {
      if (response.message === "Forbidden") {
        toast.error(t("generic.noPermissionAction"));
      }
      setMetrics(null);
      return;
    }

    setMetrics(response.data);
  };

  return { metrics, isLoading, fetchMetrics };
};
