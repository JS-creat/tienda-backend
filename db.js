const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Conexión de prueba
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Error de conexión:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
    conn.release();
  }
});

// Exportar con soporte de Promesas
module.exports = pool.promise();
