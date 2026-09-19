import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const listarInventario = async (req, res) => {
  const inventario = await prisma.inventario.findMany();
  res.json(inventario);
};

export const agregarItem = async (req, res) => {
  const { producto, stock, stockMinimo } = req.body;
  try {
    const nuevoItem = await prisma.inventario.create({
      data: { 
        producto, 
        stock, 
        stockMinimo: stockMinimo || 5 
      }
    });
    res.status(201).json(nuevoItem);
  } catch (error) {
    res.status(400).json({ error: "El producto ya existe en el inventario" });
  }
};

export const actualizarStock = async (req, res) => {
  const id = parseInt(req.params.id);
  const { stock } = req.body;

  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: "El stock debe ser un número válido mayor o igual a 0" });
  }

  try {
    const actualizado = await prisma.inventario.update({
      where: { id },
      data: { stock }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: "Item no encontrado" });
  }
};

export const alertasStock = async (req, res) => {
  
  const inventario = await prisma.inventario.findMany();
  const alertas = inventario.filter(item => item.stock < item.stockMinimo);
  
  res.json({
    mensaje: alertas.length > 0 ? "Atencion: Productos con stock bajo" : "Todo el inventario esta en niveles optimos",
    alertas
  });
};