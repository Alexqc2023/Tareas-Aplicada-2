export const validarTurno = (req, res, next) => {
  const { cliente, servicio } = req.body;
  
  if (!cliente || typeof cliente !== 'string' || cliente.trim() === '') {
    return res.status(400).json({ error: "El nombre del cliente es obligatorio" });
  }
  if (!servicio || typeof servicio !== 'string' || servicio.trim() === '') {
    return res.status(400).json({ error: "El servicio es obligatorio" });
  }
  
  next();
};

