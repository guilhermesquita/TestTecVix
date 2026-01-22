import { prisma } from "../database/client";
import { Tlogin } from "../types/validations/Auth/login";
import { Tregister } from "../types/validations/Auth/register";

export class AuthModel {
  async register(data: Tregister) {
    const { username, email, password, idBrandMaster } = data;
    return await prisma.user.create({
      data: {
        username,
        email,
        password,
        role: "member",
        idBrandMaster,
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

  async checkByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async login({ email }: Tlogin) {
    return await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
      select: {
        idUser: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginDate: true,
        password: true,
        idBrandMaster: true,
      },
    });
  }
}
