import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from "/firebase/firebase.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "/login.html";
  }

});

import { db } from "/firebase/firebase.js";
import { 
  collection, 
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let quantidadeAnterior = 0;
let pedidosCache = [];

// ================= FORMATAR =================
function formatarTotal(valor){
    return Number(valor || 0).toFixed(2);
}

// ================= CARREGAR =================
function carregarPedidos(){

  const container = document.getElementById("listaPedidos");

  onSnapshot(collection(db, "pedidos"), (snapshot) => {

    const pedidos = [];

    snapshot.forEach(docSnap => {
      pedidos.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    pedidosCache = pedidos;

    // 🔔 som
    if (pedidos.length > quantidadeAnterior) {
      const som = document.getElementById("som");
      if (som) som.play().catch(()=>{});
    }

    quantidadeAnterior = pedidos.length;

    container.innerHTML = "";

    pedidos.forEach((pedido) => {

      let itensHTML = "";

      pedido.itens.forEach(item => {
        itensHTML += `<li>${item.nome} x${item.qtd}</li>`;
      });

      container.innerHTML += `
        <div class="pedido">
          <p><b>Cliente:</b> ${pedido.cliente || "Sem nome"}</p>
          <p><b>Mesa:</b> ${pedido.mesa}</p>
          <p><b>Data:</b> ${pedido.data}</p>

          <ul>${itensHTML}</ul>

          <p><b>Total:</b> R$ ${formatarTotal(pedido.total)}</p>

          <button class="btn-imprimir" data-id="${pedido.id}">🖨 Imprimir</button>
          <button class="btn-finalizar" data-id="${pedido.id}">✔ Finalizar</button>
          <button class="btn-salvar" data-id="${pedido.id}">💾 Salvar</button>
        </div>
      `;
    });

  });

}

// ================= EVENTOS =================
document.addEventListener("click", (e) => {

  const id = e.target.dataset.id;
  if(!id) return;

  const pedido = pedidosCache.find(p => p.id === id);
  if(!pedido) return;

  // 🖨 IMPRIMIR
  if(e.target.classList.contains("btn-imprimir")){
    imprimirPedido(pedido);
  }

  // ✔ FINALIZAR
  if(e.target.classList.contains("btn-finalizar")){
    finalizarPedido(id);
  }

  // 💾 SALVAR
  if(e.target.classList.contains("btn-salvar")){
    salvarPedido(pedido);
  }

});

// ================= IMPRIMIR =================
function imprimirPedido(pedido){

let conteudo = `
<div style="font-family: monospace; text-align:center;">
<h2>🧾 PEDIDO</h2>
<p>Cliente: ${pedido.cliente || "Sem nome"}</p>
<p>Mesa: ${pedido.mesa}</p>
<p>${pedido.data}</p>
<hr>
`;

pedido.itens.forEach(item => {
conteudo += `<p>${item.nome} x${item.qtd}</p>`;
});

conteudo += `
<hr>
<p><b>Total: R$ ${formatarTotal(pedido.total)}</b></p>
<p>Obrigado! 🙌</p>
</div>
`;

const tela = window.open("", "", "width=300,height=600");

tela.document.write(conteudo);
tela.document.close();
tela.print();

}

// ================= FINALIZAR =================
async function finalizarPedido(id){

if(confirm("Finalizar pedido?")){
  await deleteDoc(doc(db, "pedidos", id));
}

}

// ================= SALVAR =================
function salvarPedido(pedido){

let texto = `PEDIDO\n`;
texto += `Cliente: ${pedido.cliente}\n`;
texto += `Mesa: ${pedido.mesa}\n`;
texto += `Data: ${pedido.data}\n\n`;

pedido.itens.forEach(item => {
  texto += `${item.nome} x${item.qtd}\n`;
});

texto += `\nTotal: R$ ${formatarTotal(pedido.total)}`;

const blob = new Blob([texto], { type: "text/plain" });
const link = document.createElement("a");

link.href = URL.createObjectURL(blob);
link.download = `pedido-${pedido.mesa}.txt`;

link.click();

}

// 🚀 INICIAR
carregarPedidos();