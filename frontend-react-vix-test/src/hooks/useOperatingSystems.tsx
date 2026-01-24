import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./useAuth";

export interface IOperatingSystem {
    id: string;
    name: string;
    category: string;
    version: string;
    description: string;
    recommend: boolean;
}

export const useOperatingSystems = () => {
    const [operatingSystems, setOperatingSystems] = useState<IOperatingSystem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAuth } = useAuth();

    const fetchOperatingSystems = async () => {
        const auth = await getAuth();
        setIsLoading(true);

        const response = await api.get<IOperatingSystem[]>({
            url: "/operating-systems",
            auth,
        });

        setIsLoading(false);

        if (response.error) {
            setOperatingSystems([]);
            return;
        }

        setOperatingSystems(response.data || []);
    };

    useEffect(() => {
        fetchOperatingSystems();
    }, []);

    return { operatingSystems, isLoading, fetchOperatingSystems };
};
