import { prisma } from "../db.js";

const obtenerUsuarioId = (req) => req.usuario?.id || req.user?.id;

export const obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      
      select: { id: true, nombre: true, email: true, rol: true }
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { nombre: nombre.trim() },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true
      }
    });

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};