// Importações
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyCY6g-aWTyeZE7GgBMqF-KPy2rv0WYWUWE",
  authDomain: "lanches-venezuela.firebaseapp.com",
  projectId: "lanches-venezuela",
  storageBucket: "lanches-venezuela.firebasestorage.app",
  messagingSenderId: "564190989905",
  appId: "1:564190989905:web:38ccd0c24933e6babb7270"
};

// Inicializa
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta
export { app, db };