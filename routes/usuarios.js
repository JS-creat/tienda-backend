const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'clave_secreta'; // cámbiala o pásala a variables de entorno

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Registro y autenticación de usuarios
 */

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso con token
 */
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    const usuario = rows[0];
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/registro', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  try {
    const hash = await bcrypt.hash(contraseña, 10);
    await db.query('INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)', [nombre, correo, hash]);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
