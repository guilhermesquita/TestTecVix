import { create } from "zustand";

export enum EOS {
  // Ubuntu
  ubuntu2404 = "ubuntu-24-04",
  ubuntu2204 = "ubuntu-22-04",

  // Debian
  debian12 = "debian-12",
  debian13 = "debian-13",

  // Arch
  archlinux = "archlinux",

  // CentOS
  centos10 = "centos-10",

  // Rocky Linux
  rockylinux9 = "rockylinux-9",

  // Windows Server
  win2019std = "windows-2019",
  win2022std = "windows-2022",

  // Fallback
  notFound = "",
}
export interface IVMSugestion {
  os: EOS | null;
  vCPU: number | null;
  ram: number | null;
  disk: number | null;
}

const INIT_STATE: IVMSugestion = {
  os: null,
  vCPU: null,
  ram: null,
  disk: null,
};

interface IVMSugestionState extends IVMSugestion {
  setVmSugestion: (vmSugestion: IVMSugestion | null) => void;
  resetAll: () => void;
}

export const useZVMSugestion = create<IVMSugestionState>((set) => ({
  ...INIT_STATE,
  setVmSugestion: (vmSugestion: IVMSugestion | null) =>
    set((state) => {
      if (!vmSugestion) {
        return { ...state, ...INIT_STATE };
      }
      return { ...state, ...vmSugestion };
    }),
  resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
}));
