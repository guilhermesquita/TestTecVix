import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { BrandMasterService } from "../services/BrandMasterService";
import { user } from "@prisma/client";
import { STATUS_CODE } from "../constants/statusCode";

export class BrandMasterController {
  private brandMasterService: BrandMasterService;

  constructor(brandMasterService?: BrandMasterService) {
    this.brandMasterService = brandMasterService || new BrandMasterService();
  }

  async getSelf(req: CustomRequest<unknown>, res: Response) {
    return res.status(STATUS_CODE.OK).json(null);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.getById(Number(idBrandMaster));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.brandMasterService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createNewBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const result = await this.brandMasterService.createNewBrandMaster(
      req.body,
      user,
    );
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async updateBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.updateBrandMaster(
      Number(idBrandMaster),
      req.body,
      user,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.deleteBrandMaster(
      Number(idBrandMaster),
      user,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async uploadLogo(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "No file uploaded" });
    }

    const result = await this.brandMasterService.uploadLogo(
      Number(idBrandMaster),
      file,
      user
    );

    return res.status(STATUS_CODE.OK).json(result);
  }
}
