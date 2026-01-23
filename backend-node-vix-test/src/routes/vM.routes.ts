import { Router } from "express";
import { VMController } from "../controllers/VMController";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";
import { isManagerOrIsAdmin } from "../auth/isManagerOrIsAdmin";
import { isAdmin } from "../auth/isAdmin";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.VM; // /api/v1/vm

const vMRoutes = Router();

export const makeVMController = () => {
  return new VMController();
};

const vMController = makeVMController();

// ========= GETs =========
vMRoutes.get(BASE_PATH, authUser, async (req, res) => {
  await vMController.listAll(req, res);
});

vMRoutes.get(`${BASE_PATH}/:idVM`, authUser, async (req, res) => {
  await vMController.getById(req, res);
});

vMRoutes.get(`${BASE_PATH}/:idVM/metrics`, authUser, async (req, res) => {
  await vMController.getMetrics(req, res);
});

// ========= POSTs =========
// vMRoutes.post(
//   BASE_PATH, // authUser,
//   // isManagerOrIsAdmin,
//   async (req, res) => {
//     await vMController.createVM(req, res);
//   },
// );

// ======== PUTs =========

vMRoutes.put(`${BASE_PATH}/:idVM`, isManagerOrIsAdmin, async (req, res) => {
  await vMController.updateVM(req, res);
});
vMRoutes.put(`${BASE_PATH}/:id/start`, isManagerOrIsAdmin, async (req, res) => {
  await vMController.startVM(req, res);
});

vMRoutes.put(`${BASE_PATH}/:id/stop`, isManagerOrIsAdmin, async (req, res) => {
  await vMController.stopVM(req, res);
});

// ======== DELETEs ========
vMRoutes.delete(`${BASE_PATH}/:idVM`, isAdmin, async (req, res) => {
  await vMController.deleteVM(req, res);
});

export { vMRoutes };
