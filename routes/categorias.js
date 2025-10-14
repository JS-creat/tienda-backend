const express = require("express");
const verifyToken = require('../verifyToken');
const router = express.Router();
const db = require("../db"); 

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Operaciones relacionadas con las categorías de productos
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categorías]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Panadería
 *     responses:
 *       200:
 *         description: Categoría creada exitosamente
 */
router.post("/", async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO categorias (nombre) VALUES (?)",
      [nombre]
    );
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Lácteos
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await db.query("UPDATE categorias SET nombre = ? WHERE id = ?", [
      nombre,
      id,
    ]);
    res.json({ id, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categorías]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría a eliminar
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
