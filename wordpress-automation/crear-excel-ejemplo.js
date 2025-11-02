/**
 * Script para crear un archivo Excel de ejemplo
 * con la estructura necesaria para las publicaciones
 */

const XLSX = require('xlsx');
const path = require('path');

// Datos de ejemplo
const datosEjemplo = [
  {
    titulo: 'Mi Primera Publicación Automatizada',
    autor: 'Juan Pérez',
    fecha_publicacion: '2025-11-02',
    extracto: 'Este es un extracto de ejemplo que aparecerá en la vista previa de la publicación.',
    texto: '<h2>Bienvenido a mi blog</h2><p>Este es el contenido completo de mi primera publicación automatizada. Puedes usar <strong>HTML</strong> para dar formato al texto.</p><p>Aquí puedes agregar párrafos, listas, enlaces y más.</p><ul><li>Punto 1</li><li>Punto 2</li><li>Punto 3</li></ul>',
    imagen_destacada: 'imagenes/ejemplo.jpg',
    categoria: 'Tecnología'
  },
  {
    titulo: 'Segunda Publicación de Prueba',
    autor: 'María García',
    fecha_publicacion: '2025-11-03',
    extracto: 'Un extracto interesante sobre el segundo artículo.',
    texto: '<h2>Contenido del segundo artículo</h2><p>Este es otro ejemplo de publicación. Puedes agregar tantas filas como necesites en el Excel.</p><p>Cada fila se convertirá en una publicación en WordPress cuando ejecutes la automatización.</p>',
    imagen_destacada: 'imagenes/ejemplo2.jpg',
    categoria: 'Noticias'
  }
];

// Crear libro de trabajo
const workbook = XLSX.utils.book_new();

// Convertir datos a hoja de cálculo
const worksheet = XLSX.utils.json_to_sheet(datosEjemplo);

// Ajustar ancho de columnas
const columnWidths = [
  { wch: 40 }, // titulo
  { wch: 20 }, // autor
  { wch: 20 }, // fecha_publicacion
  { wch: 50 }, // extracto
  { wch: 80 }, // texto
  { wch: 30 }, // imagen_destacada
  { wch: 20 }  // categoria
];
worksheet['!cols'] = columnWidths;

// Agregar hoja al libro
XLSX.utils.book_append_sheet(workbook, worksheet, 'Publicaciones');

// Guardar archivo
const rutaArchivo = path.join(__dirname, 'publicaciones.xlsx');
XLSX.writeFile(workbook, rutaArchivo);

console.log('✅ Archivo Excel de ejemplo creado exitosamente!');
console.log(`📁 Ubicación: ${rutaArchivo}`);
console.log('\n📋 Estructura del archivo:');
console.log('   - titulo: Título de la publicación (requerido)');
console.log('   - autor: Nombre del autor');
console.log('   - fecha_publicacion: Fecha en formato YYYY-MM-DD');
console.log('   - extracto: Resumen breve de la publicación');
console.log('   - texto: Contenido completo (puede incluir HTML) (requerido)');
console.log('   - imagen_destacada: Ruta a la imagen (relativa a este archivo)');
console.log('   - categoria: Nombre de la categoría');
console.log('\n💡 Puedes editar este archivo y agregar más filas para publicar múltiples artículos.');
