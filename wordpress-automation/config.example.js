/**
 * Archivo de configuración de ejemplo
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a "config.js"
 * 2. Completa los datos con tu información de WordPress
 * 3. NUNCA compartas el archivo config.js con tus credenciales
 */

module.exports = {
  // URL de tu sitio WordPress (sin barra final)
  wordpressUrl: 'https://tusitio.com',
  
  // Nombre de usuario de WordPress
  wordpressUser: 'tu_usuario',
  
  // Application Password de WordPress
  // Para generar uno:
  // 1. Ve a WordPress Admin → Usuarios → Perfil
  // 2. Busca "Contraseñas de aplicación"
  // 3. Crea una nueva contraseña
  // 4. Copia la contraseña generada aquí
  wordpressPassword: 'xxxx xxxx xxxx xxxx xxxx xxxx',
  
  // Ruta al archivo Excel (relativa a este archivo)
  excelFilePath: './publicaciones.xlsx',
  
  // Nombre de la hoja de Excel a leer
  excelSheetName: 'Publicaciones'
};
