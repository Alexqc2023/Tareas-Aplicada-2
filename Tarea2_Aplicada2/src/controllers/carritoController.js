import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const listarProductos = async (req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
};

export const agregarProducto = async (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  
  
  const productoExistente = await prisma.producto.findUnique({
    where: { nombre }
  });

  if (productoExistente) {
    const actualizado = await prisma.producto.update({
      where: { id: productoExistente.id },
      data: { cantidad: productoExistente.cantidad + cantidad }
    });
    return res.json(actualizado);
  }

  const nuevoProducto = await prisma.producto.create({
    data: { nombre, precio, cantidad }
  });
  res.status(201).json(nuevoProducto);
};

export const actualizarCantidad = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ error: "Cantidad inválida, debe ser mayor a 0" });
  }

  try {
    const actualizado = await prisma.producto.update({
      where: { id },
      data: { cantidad }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const eliminarProducto = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.producto.delete({ where: { id } });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const calcularTotal = async (req, res) => {
  const productos = await prisma.producto.findMany();
  const total = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  res.json({ total });
};

export const aplicarDescuento = async (req, res) => {
  const { porcentaje } = req.body;

 
  if (porcentaje === undefined || porcentaje < 0 || porcentaje > 50) {
    return res.status(400).json({ error: "El porcentaje debe estar entre 0 y 50" });
  }

  const productos = await prisma.producto.findMany();

  const totalSinDescuento = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const montoDescuento = totalSinDescuento * (porcentaje / 100);
  
  const totalConDescuento = totalSinDescuento - montoDescuento;

  res.json({
    totalOriginal: totalSinDescuento,
    descuentoAplicado: `${porcentaje}%`,
    totalPagar: totalConDescuento
  });
};