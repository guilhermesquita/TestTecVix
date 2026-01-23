import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { UserController } from "../controllers/UserController";
import { authUser } from "../auth/authUser";
import { isManagerOrIsAdmin } from "../auth/isManagerOrIsAdmin";
import { isAdmin } from "../auth/isAdmin";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.USERS; // /api/v1/users

const userRoutes = Router();

export const makeUserController = () => {
  return new UserController();
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

// ========= PATCHs =========
userRoutes.patch(`${BASE_PATH}/:idUser`, isAdmin, async (req, res) => {
  await userController.changeStatusUser(req, res);
});

export { userRoutes };
