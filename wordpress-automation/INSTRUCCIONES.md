# 📖 INSTRUCCIONES RÁPIDAS DE USO

## 🎯 Inicio Rápido (3 pasos)

### 1️⃣ Configurar WordPress

Edita el archivo `config.js` con tus datos:

```javascript
wordpressUrl: 'https://tusitio.com',
wordpressUser: 'tu_usuario',
wordpressPassword: 'tu_application_password'
```

**¿Cómo obtener Application Password?**
1. Ve a tu WordPress Admin
2. Usuarios → Tu Perfil
3. Busca "Contraseñas de aplicación"
4. Crea una nueva y cópiala

### 2️⃣ Preparar tus Publicaciones

Abre el archivo `publicaciones.xlsx` y agrega tus datos:

| titulo | autor | fecha_publicacion | extracto | texto | imagen_destacada | categoria |
|--------|-------|-------------------|----------|-------|------------------|-----------|
| Mi artículo | Juan | 2025-11-02 | Resumen | Contenido completo | imagenes/foto.jpg | Tecnología |

**Campos obligatorios:** `titulo` y `texto`

### 3️⃣ Publicar

**Opción A - Interfaz Web (Recomendado):**
```bash
npm start
```
Luego abre: http://localhost:3001

**Opción B - Línea de Comandos:**
```bash
npm run publicar          # Publica la última fila
npm run publicar-todas    # Publica todas las filas
```

## 🖼️ Agregar Imágenes

1. Crea una carpeta `imagenes/` en este directorio
2. Coloca tus imágenes ahí
3. En el Excel, escribe: `imagenes/nombre-imagen.jpg`

## ✅ Verificación

Después de publicar, verás:
- ✅ Confirmación de éxito
- 🔗 URL de la publicación en WordPress
- 📊 Resumen del proceso

## ⚠️ Problemas Comunes

**"Error de autenticación"**
→ Verifica tu usuario y Application Password en `config.js`

**"No se encuentra el archivo Excel"**
→ Asegúrate de que `publicaciones.xlsx` esté en esta carpeta

**"Faltan campos requeridos"**
→ Verifica que tengas al menos `titulo` y `texto` en cada fila

## 📞 ¿Necesitas más ayuda?

Lee el archivo `README.md` para documentación completa.

---

**¡Listo para publicar! 🚀**
