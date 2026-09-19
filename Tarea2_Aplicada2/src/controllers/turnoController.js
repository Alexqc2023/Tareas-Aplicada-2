import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const solicitarTurno = async (req, res) => {
  const { cliente, servicio } = req.body;
  try {
    const nuevoTurno = await prisma.turno.create({
      data: { cliente, servicio } 
    });
    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(500).json({ error: "Error al solicitar turno" });
  }
};

export const listarTurnos = async (req, res) => {
  const turnos = await prisma.turno.findMany();
  res.json(turnos);
};

export const turnosEnEspera = async (req, res) => {
  const turnos = await prisma.turno.findMany({
    where: { estado: "esperando" }
  });
  res.json({ totalEnEspera: turnos.length, turnos });
};

export const avanzarTurno = async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const turno = await prisma.turno.findUnique({ where: { id } });
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });

    
    let nuevoEstado = "";
    if (turno.estado === "esperando") nuevoEstado = "atendiendo";
    else if (turno.estado === "atendiendo") nuevoEstado = "finalizado";
    else return res.status(400).json({ error: "El turno ya esta finalizado, no puede avanzar mas" });

    const actualizado = await prisma.turno.update({
      where: { id },
      data: { estado: nuevoEstado }
    });
    
    res.json({ mensaje: `El turno avanzo a: ${nuevoEstado}`, turno: actualizado });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el turno" });
  }
};