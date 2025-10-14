const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Imágenes
 *   description: Operaciones relacionadas con las imágenes de productos
 */

/**
 * @swagger
 * /imagenes/{producto_id}:
 *   get:
 *     summary: Obtener imágenes de un producto
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de imágenes
 */
router.get('/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM imagenes_productos WHERE producto_id = ?', [producto_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /imagenes:
 *   post:
 *     summary: Agregar imagen a un producto
 *     tags: [Imágenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               producto_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Imagen agregada correctamente
 */
router.post('/', async (req, res) => {
  const { url, producto_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)',
      [url, producto_id]
    );
    res.json({ id: result.insertId, url, producto_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /imagenes/{producto_id}:
 *   put:
 *     summary: Actualizar imagen de un producto
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Imagen actualizada correctamente
 */
router.put('/:producto_id', async (req, res) => {
  const { producto_id } = req.params;
  const { url } = req.body;
  try {
    await db.query('UPDATE imagenes SET url = ? WHERE producto_id = ?', [url, producto_id]);
    res.json({ producto_id, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /imagenes/{id}:
 *   delete:
 *     summary: Eliminar una imagen
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM imagenes WHERE id = ?', [id]);
    res.json({ mensaje: 'Imagen eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
