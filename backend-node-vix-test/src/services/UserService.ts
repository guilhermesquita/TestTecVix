import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/UserModel";
import { userCreatedSchema } from "../types/validations/User/createUser";
import { userListAllSchema } from "../types/validations/User/userListAll";
import { hashPassword } from "../utils/bcrypt";
import { validateRegisterUser } from "../utils/validateRegisterUser";

export class UserService {
  constructor() {}
  private readonly userModel = new UserModel();

  async listAll(query: unknown) {
    const validQuery = userListAllSchema.parse(query);
    return await this.userModel.listAll(validQuery);
  }

  async getById(idUser: string) {
    return await this.userModel.getById(idUser);
  }

  async createUser(data: unknown) {
    const validData = userCreatedSchema.parse(data);

    await validateRegisterUser(validData);

    const password = await hashPassword(validData.password);
    const createdUser = await this.userModel.registerUser({
      ...validData,
      password,
    });

    return createdUser;
  }

  async changeStatusUser(idUser: string) {
    if (this.userModel.getById(idUser) === null) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    } else {
      const user = await this.userModel.changeStatusUser(idUser);
      if (user.isActive) {
        return { message: "User activated successfully." };
      } else {
        return { message: "User deactivated successfully." };
      }
    }
  }
}
