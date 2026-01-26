import { user, vM } from "@prisma/client";
import { VMModel } from "../models/VMModel";
import { TVMCreate, vMCreatedSchema } from "../types/validations/VM/createVM";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { TVMUpdate, vMUpdatedSchema } from "../types/validations/VM/updateVM";
import { vmListAllSchema } from "../types/validations/VM/vmListAll";
import { hashPassword } from "../utils/bcrypt";

export class VMService {
  constructor() { }

  private vMModel = new VMModel();

  async getById(idVM: number) {
    return this.vMModel.getById(idVM);
  }

  async listAll(query: unknown, user: user) {
    const validQuery = vmListAllSchema.parse({ ...query! });
    return this.vMModel.listAll({
      query: validQuery,
      idBrandMaster: user.idBrandMaster
    });
  }

  async createNewVM(data: unknown, user: user) {
    const validateData = vMCreatedSchema.parse(data);

    const isAllow = await this.verifyPermission(user, Number(validateData.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const vmNameExists = await this.vMModel.checkVMName(validateData.vmName!, Number(validateData.idBrandMaster));
    if (vmNameExists) {
      throw new AppError(ERROR_MESSAGE.VM_NAME_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
    }

    const idBrandMasterExists = validateData.idBrandMaster ? await this.vMModel.checkIdBrandMaster(Number(validateData.idBrandMaster)) : true;
    if (!idBrandMasterExists) {
      throw new AppError(ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND, STATUS_CODE.BAD_REQUEST);
    }

    const os = this.allOs().find((os) => os.id === validateData.os);
    if (!os) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const hashedPassword = await hashPassword(validateData.pass);

    const createdVM = await this.vMModel.createNewVM({
      ...validateData,
      status: "RUNNING",
      pass: hashedPassword,
    }, user);

    return createdVM;
  }

  async updateVM(idVM: number, data: unknown, user: user) {
    const validateDataSchema = vMUpdatedSchema.parse(data);
    const oldVM = await this.getById(idVM);
    const idBrandMaster = user.idBrandMaster


    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isAllow = await this.verifyPermission(user, Number(oldVM.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }

    const vmNameExists = await this.vMModel.checkVMName(validateDataSchema.vmName!, Number(oldVM.idBrandMaster));
    if (vmNameExists) {
      throw new AppError(ERROR_MESSAGE.VM_NAME_ALREADY_EXISTS, STATUS_CODE.BAD_REQUEST);
    }

    const updatedVM = await this.vMModel.updateVM(idVM, { ...validateDataSchema, idBrandMaster });
    return updatedVM;
  }

  async deleteVM(idVM: number, user: user) {
    const oldVM = await this.getById(idVM);
    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const isAllow = await this.verifyPermission(user, Number(oldVM.idBrandMaster));
    if (!isAllow) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
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

  allOs() {
    return [
      {
        id: "ubuntu-24-04",
        name: "Ubuntu",
        category: "linux",
        version: "24.04 LTS",
        description: "Distribuição Linux moderna, estável e amplamente utilizada em servidores e aplicações cloud.",
        recommend: true
      },
      {
        id: "ubuntu-22-04",
        name: "Ubuntu",
        category: "linux",
        version: "22.04 LTS",
        description: "Distribuição Linux LTS altamente estável, com amplo suporte da comunidade e ideal para produção.",
        recommend: true
      },
      {
        id: "debian-12",
        name: "Debian",
        category: "linux",
        version: "12",
        description: "Distribuição Linux focada em estabilidade e segurança, muito usada em servidores.",
        recommend: false
      },
      {
        id: "debian-13",
        name: "Debian",
        category: "linux",
        version: "13",
        description: "Versão mais recente do Debian, trazendo pacotes mais novos mantendo a confiabilidade.",
        recommend: false
      },
      {
        id: "archlinux",
        name: "Arch Linux",
        category: "linux",
        version: "Rolling Release",
        description: "Distribuição Linux avançada e altamente customizável, indicada para usuários experientes.",
        recommend: false
      },
      {
        id: "centos-10",
        name: "CentOS",
        category: "linux",
        version: "10",
        description: "Distribuição Linux baseada no ecossistema Red Hat, voltada para ambientes corporativos.",
        recommend: false
      },
      {
        id: "rockylinux-9",
        name: "Rocky Linux",
        category: "linux",
        version: "9",
        description: "Alternativa comunitária ao CentOS, focada em compatibilidade com RHEL.",
        recommend: false
      },
      {
        id: "windows-2019",
        name: "Windows Server",
        category: "windows",
        version: "2019 Standard",
        description: "Sistema operacional da Microsoft voltado para servidores e aplicações corporativas.",
        recommend: false
      },
      {
        id: "windows-2022",
        name: "Windows Server",
        category: "windows",
        version: "2022 Standard",
        description: "Versão mais recente do Windows Server, com melhorias em segurança e performance.",
        recommend: false
      }
    ];
  }
}
