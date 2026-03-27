import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from "/firebase/firebase.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "/login.html";
  }

});

// 🔥 IMPORTS
import { db } from "/firebase/firebase.js";
import { 
  collection, 
  addDoc, 
  onSnapshot,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= NORMALIZAR =================
function normalizar(texto) {
return texto
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[^a-z0-9\s]/g, "")
.trim();
}

// ================= VARIÁVEIS =================
let itensEsgotados = [];

const selects = document.querySelectorAll("select");
const btnOcultar = document.querySelector(".botoes button:nth-child(1)");
const btnMostrar = document.querySelector(".botoes button:nth-child(2)");

// ================= CAPTURAR SELECT =================
selects.forEach(select => {

    select.addEventListener("change", () => {

        const valor = select.value;

        if (valor) {
            const nome = normalizar(valor);

            if (!itensEsgotados.includes(nome)) {
                itensEsgotados.push(nome);
            }
        }

    });

});

// ================= ENVIAR ESGOTADOS =================
async function enviarEsgotados(){

    if(itensEsgotados.length === 0){
        alert("Selecione itens!");
        return;
    }

    for(const nome of itensEsgotados){
        await addDoc(collection(db, "esgotados"), { nome });
    }

    alert("Itens esgotados enviados!");
    itensEsgotados = [];
}

// ================= MOSTRAR (REMOVER ESGOTADOS) =================
async function mostrarItens(){

    const snapshot = await getDocs(collection(db, "esgotados"));

    const promises = [];

    snapshot.forEach(d => {
        promises.push(deleteDoc(doc(db, "esgotados", d.id)));
    });

    await Promise.all(promises);

    alert("Itens liberados!");
}

// ================= BOTÕES =================
btnOcultar.addEventListener("click", enviarEsgotados);
btnMostrar.addEventListener("click", mostrarItens);

// (opcional debug)
onSnapshot(collection(db, "esgotados"), (snapshot) => {
    console.log("🔥 Painel atualizou");
});