import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/UserModel";
import { Tregister } from "../types/validations/Auth/register";

export const validateRegisterUser = async (validData: Tregister) => {
  const userModel = new UserModel();
  const emailExists = await userModel.checkEmailExists(validData.email);
  if (emailExists) {
    throw new AppError(
      ERROR_MESSAGE.USER_EMAIL_ALREADY_EXISTS,
      STATUS_CODE.CONFLICT,
    );
  }

  const usernameExists = await userModel.checkUsernameExists(
    validData.username,
  );
  if (usernameExists) {
    throw new AppError(ERROR_MESSAGE.USER_ALREADY_EXISTS, STATUS_CODE.CONFLICT);
  }

  if (validData.idBrandMaster) {
    const brandMasterExists = await userModel.checkBrandMasterExists(
      validData.idBrandMaster!,
    );
    if (!brandMasterExists) {
      throw new AppError(
        ERROR_MESSAGE.BRAND_MASTER_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }
};
