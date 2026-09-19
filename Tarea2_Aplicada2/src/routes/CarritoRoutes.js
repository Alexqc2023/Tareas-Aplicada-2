import { Router } from "express";
import * as carritoController from "../controllers/carritoController.js";
import { validarProducto } from "../middlewares/carritoValidator.js";

const router = Router();

router.get("/productos", carritoController.listarProductos);

router.post("/productos", validarProducto, carritoController.agregarProducto);

router.put("/productos/:id", carritoController.actualizarCantidad);

router.delete("/productos/:id", carritoController.eliminarProducto);

router.get("/carrito/total", carritoController.calcularTotal);

router.post("/carrito/aplicar-descuento", carritoController.aplicarDescuento);

export default router;