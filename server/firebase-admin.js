// firebase-admin.js CORREGIDO
const admin = require("firebase-admin");
const serviceAccount = require("./keys/veganimo-firebase-adminsdk-fbsvc-8db481069f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veganimo.firebasedatabase.app" // URL CORRECTA
});

const db = admin.firestore();
module.exports = { admin, db };