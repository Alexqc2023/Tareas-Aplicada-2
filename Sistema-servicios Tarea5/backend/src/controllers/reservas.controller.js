import { prisma } from "../db.js";


const obtenerUsuarioId = (req) => req.usuario?.id || req.user?.id;

export const crearReserva = async (req, res) => {
  try {
    const { fecha, hora, servicioId } = req.body;
    const usuarioId = obtenerUsuarioId(req);

    if (!usuarioId) {
      return res.status(401).json({ error: "Usuario no identificado. Inicia sesion de nuevo." });
    }

    
    const partesFecha = fecha.split('-');
    if (partesFecha.length !== 3) {
      return res.status(400).json({ error: " formato de la fecha es DD-MM-YYYY (Ej: 25-10-2026)" });
    }

    const [dia, mes, anio] = partesFecha;
    const fechaReserva = new Date(`${anio}-${mes}-${dia}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaReserva < hoy) {
      return res.status(400).json({ error: "No se puede reservar una fecha del pasado" });
    }

    const reserva = await prisma.reserva.create({
      data: { fecha, hora, usuarioId: Number(usuarioId), servicioId: Number(servicioId) }
    });
    res.status(201).json(reserva);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Error en el servidor al intentar guardar la reserva" });
  }
};

export const misReservas = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: { servicio: true }
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

    if (reservaExistente.usuarioId !== Number(usuarioId)) return res.status(403).json({ error: "Esa reserva es de otro usuario" });

    if (reservaExistente.estado !== "pendiente") return res.status(400).json({ error: "Solo se cancelan reservas pendientes" });

    await prisma.reserva.delete({ where: { id: Number(id) } });
    res.json({ message: "Cancelada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar la reserva" });
  }
};