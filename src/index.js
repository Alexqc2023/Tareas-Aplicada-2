import "dotenv/config";
import express from "express";
import { requestLogger } from "./middlewares/logger.js";

import carritoRoutes from "./routes/carritoRoutes.js";

import votacionRoutes from "./routes/votacionRoutes.js";

import inventarioRoutes from "./routes/inventarioRoutes.js";

import turnoRoutes from "./routes/turnoRoutes.js";

import habitoRoutes from "./routes/habitoRoutes.js"; 

const app = express();

app.use(express.json());
app.use(requestLogger);


app.use("/", carritoRoutes);

app.use("/", votacionRoutes);

app.use("/", inventarioRoutes);

app.use("/", turnoRoutes);

app.use("/", habitoRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor ejecutandose en http://localhost:${PORT}`);
});