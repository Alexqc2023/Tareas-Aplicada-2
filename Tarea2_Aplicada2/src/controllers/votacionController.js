import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const crearEncuesta = async (req, res) => {
  const { pregunta, opciones } = req.body;
  try {
    const nuevaEncuesta = await prisma.encuesta.create({
      data: {
        pregunta,
        opciones: {
          create: opciones.map(opcion => ({ texto: opcion }))
        }
      },
      include: { opciones: true } 
    });
    res.status(201).json(nuevaEncuesta);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la encuesta" });
  }
};

export const listarEncuestas = async (req, res) => {
  const encuestas = await prisma.encuesta.findMany({
    include: { opciones: true }
  });
  res.json(encuestas);
};

export const emitirVoto = async (req, res) => {
  const idOpcion = parseInt(req.params.idOpcion);
  try {
    const opcionActualizada = await prisma.opcion.update({
      where: { id: idOpcion },
      data: { votos: { increment: 1 } }
    });
    res.json({ mensaje: "Voto registrado con exito", opcion: opcionActualizada });
  } catch (error) {
    res.status(404).json({ error: "Opcion no encontrada" });
  }
};

export const obtenerResultados = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const encuesta = await prisma.encuesta.findUnique({
      where: { id },
      include: { opciones: true }
    });
    
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    
    const totalVotos = encuesta.opciones.reduce((acc, op) => acc + op.votos, 0);
    res.json({ encuesta, totalVotos });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resultados" });
  }
};