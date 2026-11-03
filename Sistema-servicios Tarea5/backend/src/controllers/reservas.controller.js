import { prisma } from "../db.js";

const obtenerUsuarioId = (req) => req.usuario?.id || req.user?.id;


const construirFechaHora = (fechaStr, horaStr) => {
  const partesFecha = fechaStr.split('-');
  
  if (partesFecha.length !== 3) return null;
  
  const [dia, mes, anio] = partesFecha.map(Number);

  
  const matchHora = horaStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!matchHora) return null;

  let [, horas, minutos, periodo] = matchHora;
  horas = Number(horas);
  minutos = Number(minutos);

  if (periodo) {
    periodo = periodo.toUpperCase();
    if (periodo === 'PM' && horas < 12) horas += 12;
    if (periodo === 'AM' && horas === 12) horas = 0;
  }

  const fechaObj = new Date(anio, mes - 1, dia, horas, minutos, 0);
  return isNaN(fechaObj.getTime()) ? null : fechaObj;
};

export const crearReserva = async (req, res) => {
  try {
    const { fecha, hora, servicioId } = req.body;
    const usuarioId = obtenerUsuarioId(req);

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no identificado. Inicia sesion nuevamente." });
    }

    
    const fechaReserva = construirFechaHora(fecha, hora);
    if (!fechaReserva) {
      return res.status(400).json({ error: "Formato invalido. Usa DD-MM-YYYY y HH:MM AM/PM" });
    }

    const ahora = new Date();
    if (fechaReserva <= ahora) {
      return res.status(400).json({ error: "La fecha y hora de la reserva deben ser futuras" });
    }

    
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(servicioId) }
    });

    if (!servicio) {
      return res.status(404).json({ error: "El servicio seleccionado no existe" });
    }

    if (!servicio.activo) {
      return res.status(400).json({ error: "El servicio seleccionado no está activo en este momento" });
    }

    
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        usuarioId: Number(usuarioId),
        servicioId: Number(servicioId),
        fecha: fecha,
        estado: { not: "cancelada" }
      }
    });

    if (reservaExistente) {
      return res.status(409).json({
        error: "Ya tienes una reserva activa para este servicio en la fecha seleccionada"
      });
    }

    // Si pasa las 3 validaciones, guardamos en la base de datos
    const nuevaReserva = await prisma.reserva.create({
      data: {
        fecha,
        hora,
        usuarioId: Number(usuarioId),
        servicioId: Number(servicioId)
      }
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al procesar la reserva" });
  }
};

export const misReservas = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: { servicio: true },
      orderBy: { id: "desc" }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus reservas" });
  }
};

export const todasLasReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: { servicio: true, usuario: { select: { nombre: true, email: true } } }
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener todas las reservas" });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado }
    });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};

export const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = obtenerUsuarioId(req);

    const reservaExistente = await prisma.reserva.findUnique({ where: { id: Number(id) } });

    if (!reservaExistente) return res.status(404).json({ error: "Reserva no encontrada" });

    if (reservaExistente.usuarioId !== Number(usuarioId)) return res.status(403).json({ error: "No tienes permiso para cancelar esta reserva" });

    if (reservaExistente.estado !== "pendiente") return res.status(400).json({ error: "Solo se pueden cancelar reservas pendientes" });

    await prisma.reserva.delete({ where: { id: Number(id) } });
    res.json({ message: "Reserva cancelada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar la reserva" });
  }
};