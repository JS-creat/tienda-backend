const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Puerto asignado o 10000 por defecto
const PORT = process.env.PORT || 10000;

const allowedOrigin = 'https://admirable-fudge-d69549.netlify.app';

// Middleware para filtrar IPs autorizadas
app.use((req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  if (clientIP && clientIP.includes(',')) {
    clientIP = clientIP.split(',')[0].trim();
  }

  const allowedIPs = ['45.232.149.130', '45.232.149.146', '45.232.149.145'];
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado: IP no permitida' });
  }
});

// Middleware CORS y body parser
app.use(cors({
  origin: allowedOrigin
}));
app.use(bodyParser.json());

// Documentación Swagger
const { swaggerUi, swaggerSpecs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Importar rutas
const categoriasRoutes = require('./routes/categorias');
const productosRoutes = require('./routes/productos');
const imagenesRoutes = require('./routes/imagenes');
const usuariosRoutes = require('./routes/usuarios');

// Registrar rutas API
app.use('/categorias', categoriasRoutes);
app.use('/productos', productosRoutes);
app.use('/imagenes', imagenesRoutes);
app.use('/usuarios', usuariosRoutes);

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Para cualquier ruta que no sea API, devolver index.html para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});
