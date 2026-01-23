import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { VMService } from "../services/VMService";
import { STATUS_CODE } from "../constants/statusCode";
import { user } from "@prisma/client";

export class VMController {
  constructor() {}
  private vMService = new VMService();

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idVM } = req.params;
    const result = await this.vMService.getById(Number(idVM));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const result = await this.vMService.listAll(req.query, user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // async createVM(req: CustomRequest<unknown>, res: Response) {
  //   const user = req.user as user;
  //   const result = await this.vMService.createNewVM(req.body, user);
  //   return res.status(STATUS_CODE.CREATED).json(result);
  // }

  async updateVM(req: CustomRequest<unknown>, res: Response) {
    const { idVM } = req.params;
    const user = req.user as user;
    const result = await this.vMService.updateVM(Number(idVM), req.body, user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteVM(req: CustomRequest<unknown>, res: Response) {
    const { idVM } = req.params;
    const user = req.user as user;
    const result = await this.vMService.deleteVM(Number(idVM), user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async startVM(req: CustomRequest<unknown>, res: Response) {
    const { id } = req.params;
    const user = req.user as user;
    const result = await this.vMService.startVM(Number(id), user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async stopVM(req: CustomRequest<unknown>, res: Response) {
    const { id } = req.params;
    const user = req.user as user;
    const result = await this.vMService.stopVM(Number(id), user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async getMetrics(req: CustomRequest<unknown>, res: Response) {
    const { idVM } = req.params;
    const user = req.user as user;
    const result = await this.vMService.getMetrics(Number(idVM), user);
    return res.status(STATUS_CODE.OK).json(result);
  }
}
