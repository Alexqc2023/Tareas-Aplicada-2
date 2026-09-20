export const validarHabito = (req, res, next) => {
  const { nombre, meta } = req.body;
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: "El nombre del habito es obligatorio" });
  }
  if (meta === undefined || typeof meta !== 'number' || meta <= 0) {
    return res.status(400).json({ error: "La meta (dias) debe ser un numero mayor a 0" });
  }
  
  next();
};