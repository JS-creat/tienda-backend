const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones sobre productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Retorna una lista con todos los productos y sus categorías.
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   categoria:
 *                     type: string
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nombre, p.descripcion, p.precio, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - descripcion
 *               - categoria_id
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto creado exitosamente
 */
router.post('/', async (req, res) => {
  const { nombre, precio, descripcion, categoria_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, descripcion, categoria_id) VALUES (?, ?, ?, ?)',
      [nombre, precio, descripcion, categoria_id]
    );
    res.json({ id: result.insertId, nombre, precio, descripcion, categoria_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
