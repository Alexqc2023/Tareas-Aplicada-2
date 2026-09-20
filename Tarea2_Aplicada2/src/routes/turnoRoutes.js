import { Router } from "express";
import * as turnoController from "../controllers/turnoController.js";

import { validarTurno } from "../middlewares/turnoValidator.js";

const router = Router();

router.post("/turnos", validarTurno, turnoController.solicitarTurno);

router.get("/turnos", turnoController.listarTurnos);

router.get("/turnos/espera", turnoController.turnosEnEspera);

router.put("/turnos/:id/avanzar", turnoController.avanzarTurno);

export default router;