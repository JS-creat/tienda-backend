require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 10000;

const allowedOrigin = 'https://admirable-fudge-d69549.netlify.app'; // Cambia a tu URL de Netlify

// Middlewares
app.use(cors({
  origin: allowedOrigin // o mejor, tu URL de Netlify "*"
}));
app.use(bodyParser.json());

//IPs validas 
/*
app.use((req, res, next) => {
  let clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  if (clientIP && clientIP.includes(',')) {
    clientIP = clientIP.split(',')[0].trim();
  }

  const allowedIPs = ['45.232.149.130', '45.232.149.146', '45.232.149.145', '181.176.103.153']; 
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado: IP no permitida' });
  }
});
*/

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