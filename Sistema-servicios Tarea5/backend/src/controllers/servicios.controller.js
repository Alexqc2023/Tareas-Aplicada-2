import { prisma } from "../db.js";


export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};


export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, duracion, precio } = req.body;
    const servicio = await prisma.servicio.create({
      data: { nombre, descripcion, duracion: Number(duracion), precio: Number(precio) }
    });
    res.status(201).json(servicio);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};


export const editarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion, precio } = req.body;
    
    const servicioActualizado = await prisma.servicio.update({
      where: { id: parseInt(id) },
      data: { nombre, descripcion, duracion: Number(duracion), precio: Number(precio) }
    });
    res.json(servicioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};


export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.servicio.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};