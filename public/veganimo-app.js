// veganimo-app.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBmRVZL7FCOC82ziaOlAmhvekiWWncmy0g",
  authDomain: "veganimo2025-fc2b9.firebaseapp.com",
  projectId: "veganimo2025-fc2b9",
  storageBucket: "veganimo2025-fc2b9.appspot.com",
  messagingSenderId: "979861226632",
  appId: "1:979861226632:web:6bbc913fcf4303e049cb3d",
  measurementId: "G-V5TQ1HH07H"
};

// Inicialización de Firebase con verificación
if (typeof firebase === 'undefined') {
  console.error('Firebase SDK no está cargado');
} else {
  try {
    // Inicializar Firebase solo si no está ya inicializado
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    // Obtener instancias
    window.db = firebase.firestore();
    window.storage = firebase.storage();
    
    // Configuración de persistencia (opcional)
    db.enablePersistence()
      .catch((err) => {
        console.error("Error al habilitar persistencia:", err);
      });
      
    console.log("Firebase inicializado correctamente");
  } catch (error) {
    console.error("Error inicializando Firebase:", error);
  }
}