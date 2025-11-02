# 🚀 Automatización de Publicaciones en WordPress desde Excel

Sistema completo para automatizar la publicación de contenido en WordPress utilizando archivos Excel como fuente de datos.

## 📋 Características

- ✅ Lectura automática de datos desde archivos Excel
- ✅ Publicación directa en WordPress vía API REST
- ✅ Subida automática de imágenes destacadas
- ✅ Gestión automática de categorías (crea si no existe)
- ✅ Interfaz web con botón "Enviar"
- ✅ Soporte para múltiples publicaciones
- ✅ Validación de datos
- ✅ Manejo de errores en español
- ✅ Informes detallados del proceso

## 📦 Requisitos Previos

1. **Node.js** instalado (versión 14 o superior)
2. **Sitio WordPress** con acceso a la API REST
3. **Application Password** de WordPress configurado

## 🔧 Instalación

### Paso 1: Instalar dependencias

```bash
cd wordpress-automation
npm install
```

### Paso 2: Configurar WordPress

Edita el archivo `config.js` con tus datos:

```javascript
module.exports = {
  wordpressUrl: 'https://tusitio.com',  // URL de tu WordPress
  wordpressUser: 'tu_usuario',           // Tu usuario de WordPress
  wordpressPassword: 'xxxx xxxx xxxx',   // Application Password
  excelFilePath: './publicaciones.xlsx',
  excelSheetName: 'Publicaciones'
};
```

### Paso 3: Generar Application Password en WordPress

1. Inicia sesión en tu WordPress
2. Ve a **Usuarios → Perfil**
3. Desplázate hasta **"Contraseñas de aplicación"**
4. Ingresa un nombre (ej: "Automatización Excel")
5. Haz clic en **"Añadir nueva contraseña de aplicación"**
6. Copia la contraseña generada (sin espacios)
7. Pégala en `config.js`

## 📊 Estructura del Archivo Excel

El archivo Excel debe tener las siguientes columnas:

| Columna | Descripción | Requerido |
|---------|-------------|-----------|
| `titulo` | Título de la publicación | ✅ Sí |
| `autor` | Nombre del autor | ❌ No |
| `fecha_publicacion` | Fecha (YYYY-MM-DD) | ❌ No |
| `extracto` | Resumen breve | ❌ No |
| `texto` | Contenido completo (HTML permitido) | ✅ Sí |
| `imagen_destacada` | Ruta a la imagen | ❌ No |
| `categoria` | Nombre de la categoría | ❌ No |

### Crear archivo Excel de ejemplo

```bash
npm run crear-excel
```

Esto generará un archivo `publicaciones.xlsx` con datos de ejemplo.

## 🎯 Uso

### Opción 1: Interfaz Web (Recomendado)

1. **Iniciar el servidor:**
   ```bash
   npm start
   ```

2. **Abrir en el navegador:**
   ```
   http://localhost:3001
   ```

3. **Agregar datos al Excel:**
   - Abre `publicaciones.xlsx`
   - Agrega una nueva fila con los datos de tu publicación
   - Guarda el archivo

4. **Publicar:**
   - Haz clic en el botón **"Enviar Publicación"**
   - Espera a que se complete el proceso
   - ¡Listo! Tu contenido está en WordPress

### Opción 2: Línea de Comandos

**Publicar solo la última fila del Excel:**
```bash
npm run publicar
```

**Publicar todas las filas del Excel:**
```bash
npm run publicar-todas
```

## 📁 Estructura de Archivos

```
wordpress-automation/
├── config.js                    # Configuración de WordPress
├── publicar-wordpress.js        # Script principal de publicación
├── servidor.js                  # Servidor web para la interfaz
├── index.html                   # Interfaz web con botón "Enviar"
├── crear-excel-ejemplo.js       # Genera Excel de ejemplo
├── package.json                 # Dependencias del proyecto
├── publicaciones.xlsx           # Archivo Excel con datos
├── imagenes/                    # Carpeta para imágenes (crear si no existe)
└── README.md                    # Este archivo
```

## 🖼️ Manejo de Imágenes

### Preparar imágenes:

1. Crea una carpeta `imagenes/` en el directorio del proyecto
2. Coloca tus imágenes en esa carpeta
3. En el Excel, usa rutas relativas:
   - `imagenes/mi-imagen.jpg`
   - `imagenes/foto.png`

### Formatos soportados:
- JPG/JPEG
- PNG
- GIF
- WebP

## 🔍 Ejemplos de Uso

### Ejemplo 1: Publicación Simple

En el Excel:
```
titulo: "Mi primer artículo"
texto: "<p>Este es el contenido de mi artículo.</p>"
```

### Ejemplo 2: Publicación Completa

En el Excel:
```
titulo: "Guía Completa de WordPress"
autor: "Juan Pérez"
fecha_publicacion: "2025-11-02"
extracto: "Aprende todo sobre WordPress en esta guía completa."
texto: "<h2>Introducción</h2><p>WordPress es...</p>"
imagen_destacada: "imagenes/wordpress-guia.jpg"
categoria: "Tutoriales"
```

## ⚠️ Solución de Problemas

### Error: "No se puede conectar a WordPress"
- Verifica que la URL en `config.js` sea correcta
- Asegúrate de que tu sitio tenga la API REST habilitada
- Comprueba tu conexión a internet

### Error: "Autenticación fallida"
- Verifica tu usuario y Application Password
- Asegúrate de copiar la contraseña sin espacios
- Genera una nueva Application Password si es necesario

### Error: "No se encontró el archivo Excel"
- Verifica que `publicaciones.xlsx` exista en la carpeta
- Comprueba la ruta en `config.js`
- Ejecuta `npm run crear-excel` para generar uno nuevo

### Error: "Faltan campos requeridos"
- Asegúrate de que cada fila tenga al menos `titulo` y `texto`
- Verifica que los nombres de las columnas sean exactos

### Error al subir imagen
- Verifica que la ruta de la imagen sea correcta
- Asegúrate de que el archivo de imagen exista
- Comprueba que el formato sea soportado (JPG, PNG, GIF, WebP)

## 🔒 Seguridad

- ⚠️ **NUNCA** compartas tu `config.js` con las credenciales
- ⚠️ Agrega `config.js` a `.gitignore` si usas Git
- ⚠️ Usa Application Passwords, no tu contraseña principal
- ⚠️ Revoca Application Passwords que no uses

## 📝 Notas Importantes

1. **Contenido HTML:** Puedes usar HTML en el campo `texto` para dar formato
2. **Categorías:** Si la categoría no existe, se creará automáticamente
3. **Fechas:** Usa formato `YYYY-MM-DD` (ej: 2025-11-02)
4. **Imágenes:** Las rutas son relativas al archivo `config.js`
5. **Estado:** Las publicaciones se publican inmediatamente (status: 'publish')

## 🎨 Personalización

### Cambiar el puerto del servidor

Edita `servidor.js`:
```javascript
const PORT = 3001; // Cambia a tu puerto preferido
```

### Publicar como borrador

Edita `publicar-wordpress.js`, línea ~120:
```javascript
status: 'draft', // Cambia 'publish' por 'draft'
```

### Agregar más campos

1. Agrega la columna en el Excel
2. Modifica `publicar-wordpress.js` para incluir el nuevo campo
3. Consulta la [documentación de WordPress REST API](https://developer.wordpress.org/rest-api/)

## 📚 Recursos Adicionales

- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)
- [Application Passwords Guide](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/)
- [XLSX Library Documentation](https://docs.sheetjs.com/)

## 🤝 Soporte

Si encuentras problemas:

1. Revisa la sección de **Solución de Problemas**
2. Verifica los logs en la consola
3. Asegúrate de tener todas las dependencias instaladas
4. Comprueba que tu configuración sea correcta

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

**¡Disfruta automatizando tus publicaciones en WordPress! 🎉**
