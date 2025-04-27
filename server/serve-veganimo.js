const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Configuración a prueba de balas
const PUBLIC_PATH = path.resolve(__dirname, '../public');

// Middleware para mostrar detalles de las solicitudes
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Middleware para servir archivos estáticos
app.use(express.static(PUBLIC_PATH, { 
  dotfiles: 'allow', // Permite acceder a archivos ocultos
  index: false // Desactiva la indexación de directorios
}));

// Ruta principal con manejo de errores
app.get('/', (req, res) => {
  const indexPath = path.join(PUBLIC_PATH, 'index_inicio.html');
  
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('ERROR CRÍTICO: Archivo no encontrado', {
        rutaIntentada: indexPath,
        error: err
      });
      return res.status(404).send(`
        <h1>Error: Archivo no encontrado</h1>
        <p>El archivo no se encuentra en la siguiente ruta:</p>
        <pre>${indexPath}</pre>
        <h3>Verifica la estructura actual de tu directorio:</h3>
        <pre>${getDirectoryTree(PUBLIC_PATH)}</pre>
      `);
    }
    res.sendFile(indexPath);  // Asegúrate de usar la ruta absoluta
  });
});

// Función para mostrar estructura de directorios
function getDirectoryTree(dir) {
  try {
    let result = '';
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      result += stats.isDirectory() 
        ? `📁 ${file}/\n` 
        : `📄 ${file}\n`;
    });
    
    return result || '¡Directorio vacío!';
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
}

// Iniciar servidor con verificación de archivos
app.listen(PORT, () => {
  console.log(`
  ==================================
  🚀 Servidor iniciado en http://localhost:${PORT}
  ==================================
  Ruta pública: ${PUBLIC_PATH}
  
  Estructura actual:
  ${getDirectoryTree(PUBLIC_PATH)}
  `);
  
  // Verificación automática
  const requiredFiles = [
    'index_inicio.html',
    'Login/login.html',
    'Register/register.html'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(PUBLIC_PATH, file);
    const exists = fs.existsSync(filePath);
    
    console.log(
      exists ? '✅' : '❌',
      filePath,
      exists ? '' : 'NO ENCONTRADO'
    );
  });
});
