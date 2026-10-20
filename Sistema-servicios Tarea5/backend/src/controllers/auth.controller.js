import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: "El email ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const rolAsignado = rol === "admin" ? "admin" : "cliente";

    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword, rol: rolAsignado }
    });
    res.status(201).json({ id: usuario.id, nombre, email, rol: usuario.rol });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email, rol: usuario.rol }, JWT_SECRET, { expiresIn: "2h" });

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });

  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
};