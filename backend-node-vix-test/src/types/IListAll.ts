import { UserModel } from "../models/UserModel";
import { TQuery } from "./validations/Queries/queryListAll";
import { TQueryVM } from "./validations/VM/vmListAll";

export interface IListAll {
  idBrandMaster?: number | undefined | null;
  query: TQuery;
}

export interface IListAllVM {
  idBrandMaster?: number | undefined | null;
  query: TQueryVM;
}

export interface IListAllUser {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  data: UserModel[];
}
