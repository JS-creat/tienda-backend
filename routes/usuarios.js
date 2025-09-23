const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mi_secreto_ultra_seguro";

// Login
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?',
      [correo, contraseña]
    );
    if (rows.length == 0) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const usuario = rows[0];
    const token = jwt.sign({id_usuario: usuario.id, nombre: usuario.nombre},
      SECRET_KEY, 
      {expiresIn:"2h"}
    );
    res.status(200).json({
      mensaje: "login exitoso", token, usuario: usuario.nombre
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Registro
router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    console.log("📥 Datos recibidos:", req.body);

    if (!nombre || !correo || !contraseña) {
      console.log("❌ Faltan campos");
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    console.log("🔍 Revisando si existe el correo...");
    const [existe] = await db.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    console.log("Resultado SELECT:", existe);

    if (existe.length > 0) {
      console.log("⚠️ Correo ya registrado");
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    console.log("📝 Insertando en DB...");
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)",
      [nombre, correo, contraseña]
    );
    console.log("✅ Insertado:", result);

    return res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (err) {
    console.error("💥 ERROR en /usuarios/registro:", err); // 👀
    return res.status(500).json({ message: "Error al registrar usuario", error: err.message });
  }
});


module.exports = router;
