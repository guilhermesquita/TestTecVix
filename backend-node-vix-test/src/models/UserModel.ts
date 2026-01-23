/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../database/client";
import { TUserCreated } from "../types/validations/User/createUser";
import { TUserListAll } from "../types/validations/User/userListAll";

export class UserModel {
  async listAll(params: TUserListAll) {
    const page = params.query.page || 1;
    const pageSize = params.query.limit || 10;
    const orderDirection = params.query.sortOrder || "asc";

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {};

    if (params.query.idUser) {
      where.id = params.query.idUser;
    }

    if (params.query.username) {
      where.name = {
        contains: params.query.username,
        mode: "insensitive",
      };
    }

    if (params.query.email) {
      where.email = {
        contains: params.query.email,
        mode: "insensitive",
      };
    }

    if (params.query.isActive) {
      where.status = params.query.isActive;
    }

    if (params.query.role) {
      where.role = params.query.role;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...where,
          idBrandMaster: params.query.idBrandMaster,
        },
        skip,
        take,
        orderBy: {
          [params.query.sortBy || "idUser"]: orderDirection,
        },
        select: {
          idUser: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          lastLoginDate: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      totalCount,
      result: users,
    };
  }

  async getById(idUser: string) {
    const user = await prisma.user.findUnique({
      where: {
        idUser,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginDate: true,
      },
    });

    return user;
  }

  async checkEmailExists(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    return !!user;
  }

  async checkBrandMasterExists(idBrandMaster: number) {
    const brandMaster = await prisma.brandMaster.findUnique({
      where: {
        idBrandMaster,
      },
    });
    return !!brandMaster;
  }

  async checkUsernameExists(username: string) {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    return !!user;
  }

  async registerUser(data: TUserCreated) {
    const { username, email, password, role, idBrandMaster, isActive } = data;
    return await prisma.user.create({
      data: {
        username,
        email,
        password,
        role,
        idBrandMaster,
        isActive,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginDate: true,
      },
    });
  }

  async changeStatusUser(idUser: string) {
    const user = await prisma.user.findUnique({
      where: { idUser },
      select: { isActive: true },
    });

    return prisma.user.update({
      where: { idUser },
      data: {
        isActive: !user!.isActive,
      },
    });
  }
}
