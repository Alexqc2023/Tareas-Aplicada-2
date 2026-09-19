export const validarProducto = (req, res, next) => {
  const { nombre, precio, cantidad } = req.body;
  
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }
  if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: "El precio debe ser un numero positivo" });
  }
  if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser un numero positivo" });
  }
  
  next();
};