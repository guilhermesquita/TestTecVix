import { user } from "@prisma/client";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/UserModel";
import { userCreatedSchema } from "../types/validations/User/createUser";
import { userListAllSchema } from "../types/validations/User/userListAll";
import { userUpdatedSchema } from "../types/validations/User/updateUser";
import { hashPassword } from "../utils/bcrypt";
import { validateRegisterUser } from "../utils/validateRegisterUser";
import { BucketLocalService } from "./BucketLocalService";

export class UserService {
  constructor(private readonly bucketService?: BucketLocalService) { }
  private readonly userModel = new UserModel();

  private verifyPermission(
    user: user,
    targetIdBrandMaster: number | null | undefined,
  ) {
    if (
      user.idBrandMaster !== null &&
      user.idBrandMaster !== (targetIdBrandMaster ?? null)
    ) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }
  }

  async listAll(query: unknown) {
    const validQuery = userListAllSchema.parse(query);
    return await this.userModel.listAll(validQuery);
  }

  async getById(idUser: string) {
    return await this.userModel.getById(idUser);
  }

  async createUser(data: unknown, user: user) {
    const validData = userCreatedSchema.parse(data);

    this.verifyPermission(user, validData.idBrandMaster);

    await validateRegisterUser(validData);

    const password = await hashPassword(validData.password);
    const createdUser = await this.userModel.registerUser({
      ...validData,
      password,
    });

    return createdUser;
  }

  async changeStatusUser(idUser: string, user: user) {
    const userExists = await this.userModel.getById(idUser);
    if (!userExists) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    this.verifyPermission(user, userExists.idBrandMaster);

    const updatedUser = await this.userModel.changeStatusUser(idUser);
    if (updatedUser.isActive) {
      return { message: "User activated successfully." };
    } else {
      return { message: "User deactivated successfully." };
    }
  }

  async updateUser(idUser: string, data: unknown, user: user) {
    const validData = userUpdatedSchema.parse(data);

    const userExists = await this.userModel.getById(idUser);
    if (!userExists) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    this.verifyPermission(user, userExists.idBrandMaster);

    if (validData.password) {
      validData.password = await hashPassword(validData.password);
    }

    return await this.userModel.updateUser(idUser, validData);
  }

  async deleteUser(idUser: string, user: user) {
    const userExists = await this.userModel.getById(idUser);
    if (!userExists) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    this.verifyPermission(user, userExists.idBrandMaster);

    const deletedUser = await this.userModel.deleteUser(idUser);
    return deletedUser;
  }

  async uploadProfileImage(
    idUser: string,
    file: Express.Multer.File,
    user: user,
  ) {
    const userExists = await this.userModel.getById(idUser);
    if (!userExists) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    this.verifyPermission(user, userExists.idBrandMaster);

    if (!this.bucketService) {
      throw new AppError(
        "Bucket service not configured",
        STATUS_CODE.SERVER_ERROR,
      );
    }

    const { url } = await this.bucketService.uploadFile(
      process.env.R2_BUCKET_NAME || "profile-images",
      file,
    );

    const updatedUser = await this.userModel.updateProfileImage(idUser, url);

    return updatedUser;
  }
}
