// veganimo-app.js

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBmRVZL7FCOC82ziaOlAmhvekiWWncmy0g",
  authDomain: "veganimo2025-fc2b9.firebaseapp.com",
  projectId: "veganimo2025-fc2b9",
  storageBucket: "veganimo2025-fc2b9.firebasestorage.app",
  messagingSenderId: "979861226632",
  appId: "1:979861226632:web:386ea561bc3cb36d49cb3d",
  measurementId: "G-S4984DECWT"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
