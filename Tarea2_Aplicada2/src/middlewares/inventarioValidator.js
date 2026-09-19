export const validarInventario = (req, res, next) => {
  const { producto, stock } = req.body;
  
  if (!producto || typeof producto !== 'string' || producto.trim() === '') {
    return res.status(400).json({ error: "El nombre del producto es obligatorio" });
  }
  if (stock === undefined || typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: "El stock inicial debe ser un numero mayor o igual a 0" });
  }
  
  next();
};