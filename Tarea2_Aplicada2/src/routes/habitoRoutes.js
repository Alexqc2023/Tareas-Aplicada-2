import { Router } from "express";
import * as habitoController from "../controllers/habitoController.js";
import { validarHabito } from "../middlewares/habitoValidator.js";

const router = Router();

router.post("/habitos", validarHabito, habitoController.crearHabito);

router.post("/habitos/:id/registrar", habitoController.registrarDia);

router.get("/habitos/:id/progreso", habitoController.progresoHabito);

router.get("/habitos", habitoController.listarHabitos);

export default router;