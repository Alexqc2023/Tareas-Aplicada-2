export const validarEncuesta = (req, res, next) => {
  const { pregunta, opciones } = req.body;
  
  if (!pregunta || typeof pregunta !== 'string' || pregunta.trim() === '') {
    return res.status(400).json({ error: "La pregunta es obligatoria" });
  }
  if (!Array.isArray(opciones) || opciones.length < 2) {
    return res.status(400).json({ error: "Debe proporcionar al menos dos opciones en formato de arreglo" });
  }
  
  next();
};