import { prisma } from "../database/client";
import { TVMCreate } from "../types/validations/VM/createVM";
import { TVMUpdate } from "../types/validations/VM/updateVM";
import { IListAllVM } from "../types/IListAll";
import moment from "moment";

export class VMModel {
  async getById(idVM: number) {
    return await prisma.vM.findUnique({
      where: { idVM },
    });
  }

  async totalCount({ query, idBrandMaster }: IListAllVM) {
    const { status, idBrandMaster: idBrandMasterParams } = query;
    const isRetriveAllCompanies = idBrandMaster === idBrandMasterParams;

    return prisma.vM.count({
      where: {
        deletedAt: null,
        idBrandMaster:
          !idBrandMaster && isRetriveAllCompanies ? undefined : idBrandMaster,
        status,
        vmName: {
          contains: query.search,
        },
      },
    });
  }

  async listAll({ query, idBrandMaster }: IListAllVM) {
    const limit = query.limit || 0;
    const skip = query.page ? query.page * limit : query.offset || 0;
    const { status, idBrandMaster: idBrandMasterParams } = query;
    const orderBy =
      query.orderBy?.map(({ field, direction }) => ({
        [field]: direction,
      })) || [];

    const isRetriveAllCompanies = idBrandMaster === idBrandMasterParams;

    const vms = await prisma.vM.findMany({
      where: {
        deletedAt: null,
        idBrandMaster:
          !idBrandMaster && isRetriveAllCompanies ? undefined : idBrandMaster,
        status,
        vmName: {
          contains: query.search,
        },
      },
      skip,
      take: limit || undefined,
      orderBy: orderBy.length
        ? orderBy
        : {
            updatedAt: "desc",
          },
      include: {
        brandMaster: {
          select: {
            brandName: true,
            brandLogo: true,
          },
        },
      },
    });

    const totalCount = await this.totalCount({
      query,
      idBrandMaster,
    });
    return { totalCount, result: vms };
  }

  // async createNewVM(data: TVMCreate) {
  //   return await prisma.vM.create({
  //     data: { ...data },
  //   });
  // }

  async updateVM(idVM: number, data: TVMUpdate) {
    return await prisma.vM.update({
      where: { idVM },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async deleteVM(idVM: number) {
    return await prisma.vM.update({
      where: { idVM },
      data: { updatedAt: new Date(), deletedAt: new Date() },
    });
  }

  async startVM(idVM: number) {
    return await prisma.vM.update({
      where: { idVM },
      data: { status: "RUNNING", updatedAt: new Date() },
    });
  }

  async stopVM(idVM: number) {
    return await prisma.vM.update({
      where: { idVM },
      data: { status: "STOPPED", updatedAt: new Date() },
    });
  }

  async getMetrics(idVM: number) {
    const vm = await this.getById(idVM);

    if (!vm) {
      return null;
    }

    // Em um cenário real, esses dados viriam de um sistema de monitoramento (Prometheus, DataDog, etc.)
    const numPoints = 10;
    const intervalMinutes = 5; // intervalo de 5 minutos entre pontos

    const generateMetricsPoints = (totalValue: number) => {
      const points = [];
      for (let i = numPoints - 1; i >= 0; i--) {
        const usagePercent = Math.random() * 100;
        const used = parseFloat((totalValue * (usagePercent / 100)).toFixed(2));
        const timestamp = new Date(
          Date.now() - i * intervalMinutes * 60 * 1000,
        );

        points.push({
          timestamp,
          used,
          usagePercent: parseFloat(usagePercent.toFixed(2)),
        });
      }
      return points;
    };

    const metrics = {
      idVM,
      vmName: vm.vmName,
      cpu: {
        total: vm.vCPU,
        metrics: generateMetricsPoints(vm.vCPU),
      },
      ram: {
        totalGB: vm.ram,
        metrics: generateMetricsPoints(vm.ram),
      },
      disk: {
        totalGB: vm.disk,
        metrics: generateMetricsPoints(vm.disk),
      },
    };

    return metrics;
  }
}
