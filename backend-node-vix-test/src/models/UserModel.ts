/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../database/client";
import { TUserCreated } from "../types/validations/User/createUser";
import { TUserListAll } from "../types/validations/User/userListAll";

export class UserModel {

  async totalCount(params: TUserListAll) {
    const where: any = {
      deletedAt: null,
    };

    if (params.query.idUser) where.idUser = params.query.idUser;
    if (params.query.username) {
      where.username = { contains: params.query.username };
    }

    if (params.query.email) {
      where.email = { contains: params.query.email };
    }
    if (params.query.isActive !== undefined) where.isActive = params.query.isActive;
    if (params.query.role) where.role = params.query.role;
    if (params.query.idBrandMaster) where.idBrandMaster = params.query.idBrandMaster;

    return prisma.user.count({ where });
  }

  async listAll(params: TUserListAll) {
    const page = params.query.page || 1;
    const pageSize = params.query.limit || 10;
    const orderDirection = params.query.sortOrder || "asc";

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {
      deletedAt: null,
    };

    if (params.query.idUser) where.idUser = params.query.idUser;
    if (params.query.username) {
      where.username = { contains: params.query.username };
    }

    if (params.query.email) {
      where.email = { contains: params.query.email };
    }
    if (params.query.isActive !== undefined) where.isActive = params.query.isActive;
    if (params.query.role) where.role = params.query.role;
    if (params.query.idBrandMaster) where.idBrandMaster = params.query.idBrandMaster;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
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
          profileImgUrl: true,
          idBrandMaster: true,
          brandMaster: {
            select: {
              brandName: true,
              brandLogo: true,
            },
          },
        },
      }),
      this.totalCount(params),
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
        profileImgUrl: true,
        idBrandMaster: true,
        brandMaster: {
          select: {
            brandName: true,
            brandLogo: true,
          },
        }
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

  async updateUser(idUser: string, data: any) {
    return await prisma.user.update({
      where: {
        idUser,
      },
      data,
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginDate: true,
        idBrandMaster: true,
        profileImgUrl: true,
      },
    });
  }

  async deleteUser(idUser: string) {
    const user = await prisma.user.findUnique({
      where: { idUser },
      select: { username: true },
    });

    if (!user) return null;

    return await prisma.user.update({
      where: { idUser },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
        username: `${user.username} - Deleted`,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        isActive: true,
        deletedAt: true,
      },
    });
  }

  async updateProfileImage(idUser: string, profileImgUrl: string) {
    return await prisma.user.update({
      where: { idUser },
      data: { profileImgUrl },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginDate: true,
        idBrandMaster: true,
        profileImgUrl: true,
      },
    });
  }
}
