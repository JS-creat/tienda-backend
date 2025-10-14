// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Tienda - Documentación Swagger',
      version: '1.0.0',
      description: 'Documentación de la API de productos, categorías, imágenes y usuarios.',
    },
    servers: [
      {
        url: 'http://localhost:10000', // cambia si está desplegado
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // <-- Swagger leerá los comentarios en tus rutas
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpecs };
