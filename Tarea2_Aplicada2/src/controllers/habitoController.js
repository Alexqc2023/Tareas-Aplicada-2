import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const crearHabito = async (req, res) => {
  const { nombre, meta } = req.body;
  try {
    const nuevoHabito = await prisma.habito.create({
      data: { nombre, meta }
    });
    res.status(201).json(nuevoHabito);
  } catch (error) {
    res.status(400).json({ error: "El habito ya existe" });
  }
};

export const registrarDia = async (req, res) => {
  const idHabito = parseInt(req.params.id);
  const { completado } = req.body; 

  try {
    
    const habito = await prisma.habito.findUnique({ where: { id: idHabito } });
    if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

    const nuevoRegistro = await prisma.registroHabito.create({
      data: {
        completado: completado !== undefined ? completado : true,
        habitoId: idHabito
      }
    });
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el día" });
  }
};

export const progresoHabito = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const habito = await prisma.habito.findUnique({
      where: { id },
      include: { registros: true }
    });
    
    if (!habito) return res.status(404).json({ error: "Habito no encontrado" });
    

    const diasCompletados = habito.registros.filter(reg => reg.completado).length;
    const porcentajeProgreso = (diasCompletados / habito.meta) * 100;
    
    res.json({
      habito: habito.nombre,
      meta: `${habito.meta} dias`,
      diasCompletados,
      progreso: `${porcentajeProgreso.toFixed(2)}%`,
      estado: diasCompletados >= habito.meta ? "¡Meta completada!" : "En progreso"
    });
  } catch (error) {
    res.status(500).json({ error: "Error al calcular el progreso" });
  }
};

export const listarHabitos = async (req, res) => {
  const habitos = await prisma.habito.findMany({
    include: { registros: true }
  });
  res.json(habitos);
};