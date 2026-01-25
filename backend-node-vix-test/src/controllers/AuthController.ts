import { Response } from "express";
import { CustomRequest } from "../types/custom";
// import { user } from "@prisma/client";
import { STATUS_CODE } from "../constants/statusCode";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor() { }
  private authService = new AuthService();
  async register(req: CustomRequest<unknown>, res: Response): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      res.status(STATUS_CODE.CREATED).json(result);
    } catch (error) {
      console.error("Error in AuthController.register:", error);
    }
  }

  async login(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const result = await this.authService.login(req.body);
    res.status(STATUS_CODE.OK).json(result);
  }
  async refreshToken(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const { idUser } = req.params as { idUser: string };
    if (!idUser) {
      res.status(STATUS_CODE.BAD_REQUEST).json({ error: "Missing idUser" });
      return;
    }
    const result = await this.authService.refreshToken(idUser);
    res.status(STATUS_CODE.OK).json(result);
  }
}
