import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import { AuthModel } from "../models/AuthModel";
import { loginSchema } from "../types/validations/Auth/login";
import { registerSchema } from "../types/validations/Auth/register";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { genToken } from "../utils/jwt";
import { validateRegisterUser } from "../utils/validateRegisterUser";

export class AuthService {
  constructor() {}
  private readonly authModel = new AuthModel();

  async register(data: unknown) {
    const validData = registerSchema.parse(data);

    await validateRegisterUser(validData);

    const password = await hashPassword(validData.password);
    const createdUser = await this.authModel.register({
      ...validData,
      password,
    });

    const token = genToken({
      idUser: createdUser.idUser,
      role: createdUser.role,
      idBrandMaster: validData.idBrandMaster ?? null,
    });
    return { result: createdUser, token };
  }

  async login(data: unknown) {
    const validData = loginSchema.parse(data);
    const user = await this.authModel.login(validData);

    const passwordMatch = user
      ? await comparePassword(validData.password, user.password)
      : await comparePassword(validData.password, "dummy_hash");

    if (!user || !passwordMatch) {
      throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
    }

    return {
      user: {
        idUser: user.idUser,
        username: user.username,
        profileImgUrl: user.profileImgUrl,
        email: user.email,
        idBrandMaster: user.idBrandMaster,
        role: user.role,
        isActive: user.isActive,
      },
      token: user.isActive
        ? genToken({
            idUser: user.idUser,
            role: user.role,
            idBrandMaster: user.idBrandMaster ?? null,
          })
        : null,
    };
  }
}
