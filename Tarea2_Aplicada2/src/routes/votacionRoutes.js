import { Router } from "express";
import * as votacionController from "../controllers/votacionController.js";
import { validarEncuesta } from "../middlewares/votacionValidator.js";

const router = Router();

router.post("/encuestas", validarEncuesta, votacionController.crearEncuesta);

router.get("/encuestas", votacionController.listarEncuestas);

router.post("/opciones/:idOpcion/votar", votacionController.emitirVoto);

router.get("/encuestas/:id/resultados", votacionController.obtenerResultados);

export default router;