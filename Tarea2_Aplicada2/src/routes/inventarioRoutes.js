import { Router } from "express";
import * as inventarioController from "../controllers/inventarioController.js";

import { validarInventario } from "../middlewares/inventarioValidator.js";

const router = Router();

router.post("/inventario", validarInventario, inventarioController.agregarItem);

router.get("/inventario", inventarioController.listarInventario);

router.put("/inventario/:id", inventarioController.actualizarStock);

router.get("/inventario/alertas/stock", inventarioController.alertasStock);

export default router;