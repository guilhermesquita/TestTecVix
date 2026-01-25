import { create } from "zustand";
import { IUserDB } from "../hooks/useUserResources";
import { TRole } from "./useZUserProfile";

interface IColaboratorRegisterPage {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    confirmPassword: string;
    position: string;
    department: string;
    role: TRole;
    hiringDate: string;
    isActive: boolean;
    idBrandMaster: number | null;

    userList: IUserDB[];
    isEditing: string[]; // idUser is a string (UUID)
    modalOpen: null | "editedUser" | "createdUser" | "deletedUser";
    userToBeDeleted?: IUserDB | null;
    userTableFilter: string;
    brandNameFilter: string;
    companyFilter: string;
    roleFilter: string;

}

const INIT_STATE: IColaboratorRegisterPage = {
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    position: "",
    department: "",
    role: "member",
    hiringDate: "",
    isActive: true,
    idBrandMaster: null,

    userList: [],
    isEditing: [],
    modalOpen: null,
    userToBeDeleted: null,
    userTableFilter: "",
    brandNameFilter: "",
    companyFilter: "all",
    roleFilter: "all",
};

interface IColaboratorRegisterPageState extends IColaboratorRegisterPage {
    setFullName: (fullName: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    setPosition: (position: string) => void;
    setDepartment: (department: string) => void;
    setRole: (role: TRole) => void;
    setHiringDate: (hiringDate: string) => void;
    setIsActive: (isActive: boolean) => void;
    setIdBrandMaster: (idBrandMaster: number | null) => void;

    setUserList: (userList: IUserDB[]) => void;
    setIsEditing: (isEditing: string[]) => void;
    setModalOpen: (modalOpen: IColaboratorRegisterPage["modalOpen"]) => void;
    setUserToBeDeleted: (userToBeDeleted: IUserDB | null) => void;
    setUserTableFilter: (userTableFilter: string) => void;
    setBrandNameFilter: (brandNameFilter: string) => void;
    setCompanyFilter: (companyFilter: string) => void;
    setRoleFilter: (roleFilter: string) => void;
    resetAll: () => void;
}

export const useZColaboratorRegisterPage = create<IColaboratorRegisterPageState>((set) => ({
    ...INIT_STATE,
    setFullName: (fullName) => set((state) => ({ ...state, fullName })),
    setEmail: (email) => set((state) => ({ ...state, email })),
    setPhone: (phone) => set((state) => ({ ...state, phone })),
    setUsername: (username) => set((state) => ({ ...state, username })),
    setPassword: (password) => set((state) => ({ ...state, password })),
    setConfirmPassword: (confirmPassword) => set((state) => ({ ...state, confirmPassword })),
    setPosition: (position) => set((state) => ({ ...state, position })),
    setDepartment: (department) => set((state) => ({ ...state, department })),
    setRole: (role) => set((state) => ({ ...state, role })),
    setHiringDate: (hiringDate) => set((state) => ({ ...state, hiringDate })),
    setIsActive: (isActive) => set((state) => ({ ...state, isActive })),
    setIdBrandMaster: (idBrandMaster) => set((state) => ({ ...state, idBrandMaster })),

    setUserList: (userList) => set((state) => ({ ...state, userList: [...userList] })),
    setIsEditing: (isEditing) => set((state) => ({ ...state, isEditing: [...isEditing] })),
    setModalOpen: (modalOpen) => set((state) => ({ ...state, modalOpen })),
    setUserToBeDeleted: (userToBeDeleted) => set((state) => ({ ...state, userToBeDeleted })),
    setUserTableFilter: (userTableFilter) => set((state) => ({ ...state, userTableFilter })),
    setCompanyFilter: (companyFilter) => set((state) => ({ ...state, companyFilter })),
    setBrandNameFilter: (brandNameFilter) => set((state) => ({ ...state, brandNameFilter })),
    setRoleFilter: (roleFilter) => set((state) => ({ ...state, roleFilter })),
    resetAll: () => set((state) => ({
        ...state,
        ...INIT_STATE,
        userList: state.userList,
        companyFilter: state.companyFilter,
        roleFilter: state.roleFilter
    })),
}));
