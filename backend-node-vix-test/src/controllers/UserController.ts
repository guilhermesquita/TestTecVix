import { Response } from "express";
import { CustomRequest } from "../types/custom";
// import { user } from "@prisma/client";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";

export class UserController {
  constructor() {}
  private userService = new UserService();
  async listAll(req: CustomRequest<unknown>, res: Response): Promise<void> {
    // const user = req.user as user
    const result = await this.userService.listAll({
      query: req.query,
    });
    res.status(STATUS_CODE.OK).json(result);
  }

  async getById(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const { idUser } = req.params;
    const result = await this.userService.getById(idUser as string);
    res.status(STATUS_CODE.OK).json(result);
  }

  async createUser(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const result = await this.userService.createUser(req.body);
    res.status(STATUS_CODE.CREATED).json(result);
  }

  async changeStatusUser(
    req: CustomRequest<unknown>,
    res: Response,
  ): Promise<void> {
    const { idUser } = req.params;
    const result = await this.userService.changeStatusUser(idUser as string);
    res.status(STATUS_CODE.OK).json(result);
  }
}
