/**
 * Servidor HTTP simple para la interfaz web
 * 
 * Este servidor proporciona:
 * 1. La interfaz HTML en el navegador
 * 2. Un endpoint para ejecutar la publicación en WordPress
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const WordPressPublisher = require('./publicar-wordpress');

const PORT = 3001;

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Servir la página HTML principal
  if (req.url === '/' && req.method === 'GET') {
    try {
      const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error al cargar la página');
    }
    return;
  }

  // Endpoint para publicar en WordPress
  if (req.url === '/publicar' && req.method === 'POST') {
    console.log('\n📨 Solicitud de publicación recibida...');
    
    try {
      const publisher = new WordPressPublisher();
      await publisher.procesarUltima();
      
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'Publicación creada exitosamente'
      }));
    } catch (error) {
      console.error('❌ Error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
    return;
  }

  // Ruta no encontrada
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Página no encontrada');
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SERVIDOR DE AUTOMATIZACIÓN WORDPRESS INICIADO');
  console.log('='.repeat(60));
  console.log(`\n📍 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`\n📝 Instrucciones:`);
  console.log(`   1. Abre tu navegador en: http://localhost:${PORT}`);
  console.log(`   2. Agrega datos al archivo Excel (publicaciones.xlsx)`);
  console.log(`   3. Haz clic en el botón "Enviar Publicación"`);
  console.log(`   4. ¡Tu contenido se publicará en WordPress!`);
  console.log(`\n⏹️  Para detener el servidor: Ctrl + C`);
  console.log('='.repeat(60) + '\n');
});

// Manejo de errores del servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso.`);
    console.error(`   Intenta cerrar otras aplicaciones o usa otro puerto.`);
  } else {
    console.error('❌ Error del servidor:', error.message);
  }
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
