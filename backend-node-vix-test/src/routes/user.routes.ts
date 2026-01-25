import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { UserController } from "../controllers/UserController";
import { authUser } from "../auth/authUser";
import { isManagerOrIsAdmin } from "../auth/isManagerOrIsAdmin";
import { isAdmin } from "../auth/isAdmin";
import { isSelfOrIsManagerOrIsAdm } from "../auth/isSelfOrIsManagerOrIsAdm";
import { BucketLocalService } from "../services/BucketLocalService";
import { UserService } from "../services/UserService";
import { upload } from "../middlewares/upload";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USERS; // /api/v1/users

const userRoutes = Router();

export const makeUserController = () => {
  const bucketService = new BucketLocalService();
  const userService = new UserService(bucketService);
  return new UserController(userService);
};

const userController = makeUserController();

// ========= GETs =========
userRoutes.get(BASE_PATH, authUser, async (req, res) => {
  await userController.listAll(req, res);
});

userRoutes.get(`${BASE_PATH}/:idUser`, authUser, async (req, res) => {
  await userController.getById(req, res);
});

// ========= POSTs =========
userRoutes.post(BASE_PATH, isManagerOrIsAdmin, async (req, res) => {
  await userController.createUser(req, res);
});

// ========= PUTs =========
userRoutes.put(
  `${BASE_PATH}/:idUser/image`,
  isSelfOrIsManagerOrIsAdm,
  upload.single("file"),
  async (req, res) => {
    await userController.uploadProfileImage(req, res);
  },
);

userRoutes.put(
  `${BASE_PATH}/:idUser`,
  isSelfOrIsManagerOrIsAdm,
  async (req, res) => {
    await userController.updateUser(req, res);
  },
);

userRoutes.put(
  `${BASE_PATH}/change-status/:idUser`,
  isManagerOrIsAdmin,
  async (req, res) => {
    await userController.changeStatusUser(req, res);
  },
);

// ========= DELETEs =========
userRoutes.delete(`${BASE_PATH}/:idUser`, isAdmin, async (req, res) => {
  await userController.deleteUser(req, res);
});

export { userRoutes };

