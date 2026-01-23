export interface IPayload {
  idUser: string;
  role: string;
  idBrandMaster?: number | null;
  iat?: number;
  exp?: number;
}
