/**
 * Script de Automatización para Publicar en WordPress desde Excel
 * 
 * Este script lee datos de un archivo Excel y los publica en WordPress
 * utilizando la API REST de WordPress.
 */

const XLSX = require('xlsx');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Clase principal para gestionar publicaciones en WordPress
 */
class WordPressPublisher {
  constructor() {
    this.baseUrl = config.wordpressUrl;
    this.auth = {
      username: config.wordpressUser,
      password: config.wordpressPassword.replace(/\s/g, '') // Eliminar espacios
    };
  }

  /**
   * Lee el archivo Excel y retorna los datos
   */
  leerExcel() {
    try {
      console.log('📖 Leyendo archivo Excel...');
      const workbook = XLSX.readFile(config.excelFilePath);
      const sheetName = config.excelSheetName || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const datos = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`✅ Se encontraron ${datos.length} filas en el Excel`);
      return datos;
    } catch (error) {
      console.error('❌ Error al leer el archivo Excel:', error.message);
      throw error;
    }
  }

  /**
   * Valida que una fila tenga los datos mínimos requeridos
   */
  validarDatos(fila) {
    const camposRequeridos = ['titulo', 'texto'];
    const camposFaltantes = camposRequeridos.filter(campo => !fila[campo]);
    
    if (camposFaltantes.length > 0) {
      throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Sube una imagen a WordPress y retorna su ID
   */
  async subirImagen(rutaImagen) {
    try {
      if (!rutaImagen || !fs.existsSync(rutaImagen)) {
        console.log('⚠️  No se encontró la imagen o la ruta está vacía');
        return null;
      }

      console.log(`📤 Subiendo imagen: ${path.basename(rutaImagen)}`);
      
      const formData = new FormData();
      formData.append('file', fs.createReadStream(rutaImagen));
      
      const response = await axios.post(
        `${this.baseUrl}/wp-json/wp/v2/media`,
        formData,
        {
          auth: this.auth,
          headers: formData.getHeaders()
        }
      );
      
      console.log(`✅ Imagen subida exitosamente (ID: ${response.data.id})`);
      return response.data.id;
    } catch (error) {
      console.error('❌ Error al subir la imagen:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Obtiene o crea una categoría por nombre
   */
  async obtenerOCrearCategoria(nombreCategoria) {
    try {
      if (!nombreCategoria) {
        return null;
      }

      // Buscar categoría existente
      const response = await axios.get(
        `${this.baseUrl}/wp-json/wp/v2/categories`,
        {
          auth: this.auth,
          params: { search: nombreCategoria }
        }
      );

      if (response.data.length > 0) {
        const categoria = response.data.find(cat => 
          cat.name.toLowerCase() === nombreCategoria.toLowerCase()
        );
        if (categoria) {
          console.log(`📁 Categoría encontrada: ${nombreCategoria} (ID: ${categoria.id})`);
          return categoria.id;
        }
      }

      // Crear nueva categoría
      console.log(`📁 Creando nueva categoría: ${nombreCategoria}`);
      const nuevaCategoria = await axios.post(
        `${this.baseUrl}/wp-json/wp/v2/categories`,
        { name: nombreCategoria },
        { auth: this.auth }
      );
      
      console.log(`✅ Categoría creada (ID: ${nuevaCategoria.data.id})`);
      return nuevaCategoria.data.id;
    } catch (error) {
      console.error('❌ Error al gestionar categoría:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Crea una publicación en WordPress
   */
  async crearPublicacion(datos) {
    try {
      console.log(`\n📝 Preparando publicación: "${datos.titulo}"`);
      
      // Validar datos
      this.validarDatos(datos);

      // Subir imagen destacada si existe
      let imagenDestacadaId = null;
      if (datos.imagen_destacada) {
        const rutaImagen = path.resolve(path.dirname(config.excelFilePath), datos.imagen_destacada);
        imagenDestacadaId = await this.subirImagen(rutaImagen);
      }

      // Obtener o crear categoría
      let categoriaId = null;
      if (datos.categoria) {
        categoriaId = await this.obtenerOCrearCategoria(datos.categoria);
      }

      // Preparar datos de la publicación
      const publicacion = {
        title: datos.titulo,
        content: datos.texto,
        status: 'publish', // Publicar inmediatamente
        author: 1 // ID del autor (por defecto 1)
      };

      // Agregar campos opcionales
      if (datos.extracto) {
        publicacion.excerpt = datos.extracto;
      }

      if (datos.fecha_publicacion) {
        // Convertir fecha de Excel a formato ISO
        const fecha = this.convertirFechaExcel(datos.fecha_publicacion);
        if (fecha) {
          publicacion.date = fecha;
        }
      }

      if (imagenDestacadaId) {
        publicacion.featured_media = imagenDestacadaId;
      }

      if (categoriaId) {
        publicacion.categories = [categoriaId];
      }

      // Crear la publicación
      console.log('🚀 Publicando en WordPress...');
      const response = await axios.post(
        `${this.baseUrl}/wp-json/wp/v2/posts`,
        publicacion,
        { auth: this.auth }
      );

      console.log(`✅ ¡Publicación creada exitosamente!`);
      console.log(`   URL: ${response.data.link}`);
      console.log(`   ID: ${response.data.id}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear la publicación:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Convierte fecha de Excel a formato ISO
   */
  convertirFechaExcel(fecha) {
    try {
      if (typeof fecha === 'number') {
        // Fecha en formato serial de Excel
        const fechaExcel = XLSX.SSF.parse_date_code(fecha);
        return new Date(
          fechaExcel.y,
          fechaExcel.m - 1,
          fechaExcel.d,
          fechaExcel.H || 0,
          fechaExcel.M || 0,
          fechaExcel.S || 0
        ).toISOString();
      } else if (typeof fecha === 'string') {
        // Intentar parsear como string
        const fechaObj = new Date(fecha);
        if (!isNaN(fechaObj.getTime())) {
          return fechaObj.toISOString();
        }
      }
      return null;
    } catch (error) {
      console.warn('⚠️  No se pudo convertir la fecha:', fecha);
      return null;
    }
  }

  /**
   * Procesa todas las filas del Excel
   */
  async procesarTodas() {
    try {
      const datos = this.leerExcel();
      
      if (datos.length === 0) {
        console.log('⚠️  No hay datos para procesar');
        return;
      }

      console.log(`\n🔄 Procesando ${datos.length} publicación(es)...\n`);
      
      const resultados = {
        exitosas: 0,
        fallidas: 0,
        errores: []
      };

      for (let i = 0; i < datos.length; i++) {
        const fila = datos[i];
        console.log(`\n--- Procesando fila ${i + 1} de ${datos.length} ---`);
        
        try {
          await this.crearPublicacion(fila);
          resultados.exitosas++;
        } catch (error) {
          resultados.fallidas++;
          resultados.errores.push({
            fila: i + 1,
            titulo: fila.titulo || 'Sin título',
            error: error.message
          });
        }
      }

      // Mostrar resumen
      console.log('\n' + '='.repeat(50));
      console.log('📊 RESUMEN DE PUBLICACIONES');
      console.log('='.repeat(50));
      console.log(`✅ Exitosas: ${resultados.exitosas}`);
      console.log(`❌ Fallidas: ${resultados.fallidas}`);
      
      if (resultados.errores.length > 0) {
        console.log('\n❌ Errores encontrados:');
        resultados.errores.forEach(err => {
          console.log(`   Fila ${err.fila} (${err.titulo}): ${err.error}`);
        });
      }
      
      console.log('='.repeat(50) + '\n');
      
      return resultados;
    } catch (error) {
      console.error('❌ Error fatal:', error.message);
      throw error;
    }
  }

  /**
   * Procesa solo la última fila del Excel (nueva publicación)
   */
  async procesarUltima() {
    try {
      const datos = this.leerExcel();
      
      if (datos.length === 0) {
        console.log('⚠️  No hay datos para procesar');
        return;
      }

      const ultimaFila = datos[datos.length - 1];
      console.log('\n🔄 Procesando última publicación del Excel...\n');
      
      await this.crearPublicacion(ultimaFila);
      
      console.log('\n✅ ¡Proceso completado exitosamente!\n');
      return true;
    } catch (error) {
      console.error('\n❌ Error al procesar la publicación:', error.message);
      throw error;
    }
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 AUTOMATIZACIÓN DE PUBLICACIONES EN WORDPRESS');
  console.log('='.repeat(50) + '\n');

  const publisher = new WordPressPublisher();
  
  // Verificar argumentos de línea de comandos
  const args = process.argv.slice(2);
  const modo = args[0] || 'ultima'; // 'ultima' o 'todas'

  try {
    if (modo === 'todas') {
      await publisher.procesarTodas();
    } else {
      await publisher.procesarUltima();
    }
  } catch (error) {
    console.error('\n❌ Error fatal en la ejecución:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

// Exportar para uso en otros módulos
module.exports = WordPressPublisher;
