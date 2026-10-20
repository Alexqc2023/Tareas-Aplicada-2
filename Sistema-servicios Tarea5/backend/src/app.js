import "dotenv/config";
import express from "express";
import cors from "cors";
import { registro, login } from "./controllers/auth.controller.js";
import { obtenerServicios, crearServicio, editarServicio, eliminarServicio } from "./controllers/servicios.controller.js";
import { verificarToken, soloAdmin } from "./middlewares/auth.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth/registro", registro);

app.post("/auth/login", login);

app.get("/servicios", verificarToken, obtenerServicios);

app.post("/servicios", verificarToken, soloAdmin, crearServicio);

app.put("/servicios/:id", verificarToken, soloAdmin, editarServicio);

app.delete("/servicios/:id", verificarToken, soloAdmin, eliminarServicio);

export default app;