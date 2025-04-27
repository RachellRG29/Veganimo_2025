// veganimo-app.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBmRVZL7FCOC82ziaOlAmhvekiWWncmy0g",
  authDomain: "veganimo2025-fc2b9.firebaseapp.com",
  projectId: "veganimo2025-fc2b9",
  storageBucket: "veganimo2025-fc2b9.firebasestorage.app",
  messagingSenderId: "979861226632",
  appId: "1:979861226632:web:6bbc913fcf4303e049cb3d",
  measurementId: "G-V5TQ1HH07H"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
