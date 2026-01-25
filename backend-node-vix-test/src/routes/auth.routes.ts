import { Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { AuthController } from "../controllers/AuthController";
import { authUser } from "../auth/authUser";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.AUTH; // /api/v1/auth

const authRoutes = Router();

export const makeAuthController = () => {
  return new AuthController();
};

const authController = makeAuthController();



// ========= POSTs =========
authRoutes.post(`${BASE_PATH}/register`, async (req, res) => {
  await authController.register(req, res);
});
authRoutes.post(`${BASE_PATH}/login`, async (req, res) => {
  await authController.login(req, res);
});

// ========= GETs =========
authRoutes.get(`${BASE_PATH}/token/:idUser`, authUser, async (req, res) => {
  await authController.refreshToken(req, res);
});

export { authRoutes };
