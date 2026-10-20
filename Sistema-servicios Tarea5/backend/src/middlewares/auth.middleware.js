import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expirado o invalido" });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: solo administradores" });
  }
  next();
};