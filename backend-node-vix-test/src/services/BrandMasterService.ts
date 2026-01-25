import { brandMaster, user } from "@prisma/client";
import { BrandMasterModel } from "../models/BrandMasterModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import {
  brandMasterSchema,
  TBrandMaster,
} from "../types/validations/BrandMaster/createBrandMaster";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { IBucketService } from "../types/Interfaces/IBucketService";

export class BrandMasterService {
  constructor(private bucketService?: IBucketService) { }
  private brandMasterModel = new BrandMasterModel();

  async getSelf(domain: string) {
    return await this.brandMasterModel.getSelf(domain);
  }

  async getById(idBrandMaster: number) {
    return this.brandMasterModel.getById(idBrandMaster);
  }

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.brandMasterModel.listAll(validQuery);
  }

  async createNewBrandMaster(data: TBrandMaster, user: user) {
    const validData = brandMasterSchema.parse(data);

    if (validData.contract) {
      validData.contractAt = new Date();
    }

    if (validData.isPoc) {
      validData.pocOpenedAt = new Date();
    }

    const hasBrandMaster = user.idBrandMaster !== null;

    if (hasBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }

    const brandMasterExists = await this.brandMasterModel.checkBrandMasterExists(validData.brandName!);
    if (brandMasterExists) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_ALREADY_EXISTS,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const newBrandMaster =
      await this.brandMasterModel.createNewBrandMaster(validData);

    return newBrandMaster;
  }

  private async update({
    validData,
    idBrandMaster,
  }: {
    user: user;
    validData: TBrandMaster;
    idBrandMaster: number;
    oldBrandMaster: brandMaster;
  }) {
    return await this.brandMasterModel.updateBrandMaster(
      idBrandMaster,
      validData,
    );
  }

  async updateBrandMaster(idBrandMaster: number, data: unknown, user: user) {
    if (user.idBrandMaster && user.idBrandMaster !== idBrandMaster) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }
    const validData = brandMasterSchema.parse(data);
    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
    const brandMasterExists = await this.brandMasterModel.checkBrandMasterExists(validData.brandName!);
    if (oldBrandMaster.brandName !== validData.brandName && brandMasterExists) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_ALREADY_EXISTS,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    if (
      !oldBrandMaster.contract &&
      validData.contract &&
      !oldBrandMaster.contractAt
    ) {
      validData.contractAt = new Date();
    }

    if (
      validData.isPoc === true &&
      oldBrandMaster.isPoc !== true &&
      !oldBrandMaster.pocOpenedAt
    ) {
      validData.pocOpenedAt = new Date();
    }

    return this.update({
      user,
      validData,
      idBrandMaster,
      oldBrandMaster,
    });
  }

  async deleteBrandMaster(idBrandMaster: number, user: user) {
    const oldBrandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!oldBrandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    const deletedBrand =
      await this.brandMasterModel.deleteBrandMaster(idBrandMaster);

    return {
      brandMaster: deletedBrand,
    };
  }

  async uploadLogo(idBrandMaster: number, file: Express.Multer.File, user: user) {
    if (user.idBrandMaster && user.idBrandMaster !== idBrandMaster) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const brandMaster = await this.brandMasterModel.getById(idBrandMaster);
    if (!brandMaster) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    if (!this.bucketService) {
      throw new AppError("Bucket service not configured", STATUS_CODE.SERVER_ERROR);
    }

    const { url } = await this.bucketService.uploadFile(
      process.env.R2_BUCKET_NAME || "logos",
      file
    );

    const updatedBrandMaster = await this.brandMasterModel.updateBrandMaster(
      idBrandMaster,
      { ...brandMaster, brandLogo: url } as any
    );

    return updatedBrandMaster;
  }
}
