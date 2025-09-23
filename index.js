const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
