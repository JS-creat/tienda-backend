require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors({
  origin: "*" // o mejor, tu URL de Netlify
}));
app.use(bodyParser.json());

// === Documentación Swagger ===
const { swaggerUi, swaggerSpecs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


// Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');  

// Registrar rutas
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/usuarios', usuariosRoutes);  

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});