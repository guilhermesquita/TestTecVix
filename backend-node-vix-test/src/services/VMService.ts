import { user, vM } from "@prisma/client";
import { VMModel } from "../models/VMModel";
import { TVMCreate, vMCreatedSchema } from "../types/validations/VM/createVM";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { TVMUpdate, vMUpdatedSchema } from "../types/validations/VM/updateVM";
import { vmListAllSchema } from "../types/validations/VM/vmListAll";

export class VMService {
  constructor() {}

  private vMModel = new VMModel();

  async getById(idVM: number) {
    return this.vMModel.getById(idVM);
  }

  async listAll(query: unknown, user: user) {
    const validQuery = vmListAllSchema.parse(query);
    return this.vMModel.listAll({
      query: validQuery,
      // idBrandMaster: user.idBrandMaster,
    });
  }

  // async createNewVM(data: unknown, user: user) {
  //   const validateData = vMCreatedSchema.parse(data);

  //   const createdVM = await this.vMModel.createNewVM({
  //     ...validateData,
  //     status: "RUNNING",
  //   });

  //   return createdVM;
  // }

  async updateVM(idVM: number, data: unknown, user: user) {
    const validateDataSchema = vMUpdatedSchema.parse(data);
    const oldVM = await this.getById(idVM);

    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const updatedVM = await this.vMModel.updateVM(idVM, validateDataSchema);
    return updatedVM;
  }

  async deleteVM(idVM: number, user: user) {
    const oldVM = await this.getById(idVM);
    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const deletedVm = await this.vMModel.deleteVM(idVM);
    return deletedVm;
  }

  async startVM(idVM: number, user: user) {
    const vm = await this.getById(idVM);
    if (!vm) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isAllow = await this.verifyPermission(user, Number(vm.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    if (vm.status === "RUNNING") {
      throw new AppError("VM already running", STATUS_CODE.BAD_REQUEST);
    }

    const startedVM = await this.vMModel.startVM(idVM);
    return startedVM;
  }

  async stopVM(idVM: number, user: user) {
    const vm = await this.getById(idVM);
    if (!vm) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isAllow = await this.verifyPermission(user, Number(vm.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    if (vm.status === "STOPPED") {
      throw new AppError("VM already stopped", STATUS_CODE.BAD_REQUEST);
    }

    const stoppedVM = await this.vMModel.stopVM(idVM);
    return stoppedVM;
  }

  async getMetrics(idVM: number, user: user) {
    const vm = await this.getById(idVM);
    if (!vm) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isAllow = await this.verifyPermission(user, Number(vm.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    return this.vMModel.getMetrics(idVM);
  }

  async verifyPermission(user: user, idBrandMaster: number) {
    if (user.idBrandMaster !== null && user.idBrandMaster !== idBrandMaster) {
      return false;
    } else {
      return true;
    }
  }
}
