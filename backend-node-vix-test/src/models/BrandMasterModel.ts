import { prisma } from "../database/client";
import { TBrandMaster } from "../types/validations/BrandMaster/createBrandMaster";
import { TQuery } from "../types/validations/Queries/queryListAll";
import moment from "moment";

export class BrandMasterModel {
  async getSelf(domain: string) {
    if (!domain) return null;

    const parts = domain.split(".");

    const hostAppWeb = process.env.HOST_APP_WEB;

    const hasPrefix =
      (hostAppWeb && domain.includes(hostAppWeb) && parts.length > 1) ||
      (parts.length > 2 && parts[0] !== "www");

    if (!hasPrefix) {
      return null;
    }
    return prisma.brandMaster.findFirst({
      where: {
        domain: {
          contains: domain,
        },
        deletedAt: null,
      },
      select: {
        idBrandMaster: true,
        brandName: true,
        brandLogo: true,
        domain: true,
        setorName: true,
        fieldName: true,
        location: true,
        city: true,
        emailContact: true,
        smsContact: true,
        timezone: true,
        manual: true,
        termsOfUse: true,
        privacyPolicy: true,
      },
    });
  }

  async getById(idBrandMaster: number) {
    return prisma.brandMaster.findUnique({
      where: { idBrandMaster },
    });
  }

  async totalCount(query: TQuery, isIncludeDeleted?: boolean) {
    return prisma.brandMaster.count({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        isPoc: query.isPoc,
        brandName: {
          contains: query.search,
        },
      },
    });
  }

  async listAll(query: TQuery, isIncludeDeleted?: boolean) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const brands = await prisma.brandMaster.findMany({
      where: {
        ...(!isIncludeDeleted && { deletedAt: null }),
        isPoc: query.isPoc,
        brandName: {
          contains: query.search,
        },
      },
      take: limit || undefined,
      skip,
      ...(orderBy.length ? { orderBy } : { orderBy: [{ updatedAt: "desc" }] }),
    });

    const totalCount = await this.totalCount(query, isIncludeDeleted);
    return { totalCount, result: brands };
  }

  async checkBrandMasterExists(brandName: string) {
    return prisma.brandMaster.findFirst({
      where: { brandName },
    });
  }

  async createNewBrandMaster(data: TBrandMaster) {
    return prisma.brandMaster.create({ data });
  }

  async updateBrandMaster(idBrandMaster: number, data: TBrandMaster) {
    return prisma.brandMaster.update({
      where: { idBrandMaster },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteBrandMaster(idBrandMaster: number) {
    const brand = await this.getById(idBrandMaster);
    if (!brand) return null;

    return prisma.brandMaster.update({
      where: { idBrandMaster },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date(),
        brandName: `${brand.brandName} Deleted`,
      },
    });
  }
}
