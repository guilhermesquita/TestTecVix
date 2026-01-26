import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";
import { user } from "@prisma/client";

export class UserController {
  constructor(private readonly userService = new UserService()) { }
  async listAll(req: CustomRequest<unknown>, res: Response): Promise<void> {
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
    const user = req.user as user;
    const result = await this.userService.createUser(req.body, user);
    res.status(STATUS_CODE.CREATED).json(result);
  }

  async changeStatusUser(
    req: CustomRequest<unknown>,
    res: Response,
  ): Promise<void> {
    const { idUser } = req.params;
    const user = req.user as user;
    const result = await this.userService.changeStatusUser(
      idUser as string,
      user,
    );
    res.status(STATUS_CODE.OK).json(result);
  }

  async updateUser(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const { idUser } = req.params;
    const user = req.user as user;
    const result = await this.userService.updateUser(
      idUser as string,
      req.body,
      user,
    );
    res.status(STATUS_CODE.OK).json(result);
  }

  async deleteUser(req: CustomRequest<unknown>, res: Response): Promise<void> {
    const { idUser } = req.params;
    const user = req.user as user;
    const result = await this.userService.deleteUser(idUser as string, user);
    res.status(STATUS_CODE.OK).json(result);
  }

  async uploadProfileImage(
    req: CustomRequest<unknown>,
    res: Response,
  ): Promise<void> {
    const { idUser } = req.params;
    const user = req.user as user;
    const file = req.file;

    if (!file) {
      res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "No file uploaded" });
      return;
    }

    const result = await this.userService.uploadProfileImage(
      idUser as string,
      file,
      user,
    );
    res.status(STATUS_CODE.OK).json(result);
  }
}
