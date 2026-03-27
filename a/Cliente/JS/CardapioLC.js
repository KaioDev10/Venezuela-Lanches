// 🔥 IMPORTS (SEMPRE NO TOPO)
import { db } from "/firebase/firebase.js";
import { 
  collection, 
  addDoc, 
  onSnapshot 
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

// ================= PRODUTOS =================
const produtos = [
{
categoria:"Pastéis",
itens:[
{nome:"Pastel de Carne",preco:5,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Frango",preco:5,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Queijo",preco:5,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Carne e Queijo",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Carne e Cheddar",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Carne e Catupiry",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Carne e Ovo",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Frango e Queijo",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Frango e Catupiry",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Frango e Cheddar",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"},
{nome:"Pastel de Frango e Ovo",preco:8,img:"/a/Cliente/img_comida/img-pastel.jpeg"}
]
},
{
categoria:"Hot dogs",
itens:[
{nome:"Hot dog",preco:10,img:"/a/Cliente/img_comida/-img-cachorroquente.jpeg"},
{nome:"Hot dog duplo",preco:14,img:"/a/Cliente/img_comida/-img-cachorroquente.jpeg"},
{nome:"Hot dog bacon",preco:15,img:"/a/Cliente/img_comida/-img-cachorroquente.jpeg"},
{nome:"Hot dog calabresa",preco:15,img:"/a/Cliente/img_comida/-img-cachorroquente.jpeg"},
{nome:"Hot dog especial",preco:17,img:"/a/Cliente/img_comida/-img-cachorroquente.jpeg"}
]
},
{
categoria:"Empanados",
itens:[
{nome:"Empanada de Frango",preco:10,img:"/a/Cliente/img_comida/img-empanada.jpeg"},
{nome:"Empanada de Carne",preco:10,img:"/a/Cliente/img_comida/img-empanada.jpeg"}
]
},
{
categoria:"Espetinhos",
itens:[
{nome:"Espetinho de Frango",preco:15,img:"/a/Cliente/img_comida/img-espeto_frango.jpeg"},
{nome:"Espetinho de Carne",preco:15,img:"/a/Cliente/img_comida/img-espeto_carne.jpeg"},
{nome:"Espetinho de Linguiça",preco:15,img:"/a/Cliente/img_comida/img-espeto_linguica.jpeg"},
{nome:"Espetinho Misto",preco:15,img:"/a/Cliente/img_comida/img-espeto_carne.jpeg"}
]
},
{
categoria:"Diversos",
itens:[
{nome:"Batata Frita 250g",preco:13,img:"/a/Cliente/img_comida/img-batata250g.jpeg"},
{nome:"Salchi batata meia",preco:16,img:"/a/Cliente/img_comida/img-salchi_batata.jpeg"},
{nome:"Arroz frito chines meia",preco:25,img:"/a/Cliente/img_comida/img-arroz.jpeg"}
]
},
{
categoria:"Bebidas",
itens:[
{nome:"Coca-Cola lata",preco:6,img:"/a/Cliente/img_comida/img-coca_lata.jpeg"},
{nome:"Guaraná Antártica lata",preco:6,img:"/a/Cliente/img_comida/img-guarana_lata.jpeg"},
{nome:"Fanta laranja lata",preco:6,img:"/a/Cliente/img_comida/img-fanta_laranja.jpeg"},
{nome:"Fanta uva lata",preco:6,img:"/a/Cliente/img_comida/img-fanta_lata.jpeg"},
{nome:"Água",preco:4,img:"/a/Cliente/img_comida/img-garrafa_agua.jpeg"}
]
}
];
const cardapio = document.getElementById("cardapio");

// ================= RENDER =================

produtos.forEach(categoria => {

let html = `<div class="categoria-bloco"><h1>${categoria.categoria}</h1>`;

categoria.itens.forEach(item => {

html += `
<div class="item">
<img src="${item.img}">
<div class="info">
<span>${item.nome}</span>
<b>R$ ${item.preco.toFixed(2)}</b>

<div class="controle">
<button class="menos">-</button>
<input type="text" value="0" readonly data-preco="${item.preco}" data-nome="${item.nome}">
<button class="mais">+</button>
</div>

</div>
</div>
`;

});

html += `</div>`;
cardapio.innerHTML += html;

});

// ================= TOTAL =================
function calcularTotal(){
let total = 0;
let lista = "";

const nome = document.getElementById("nm").value;
const mesa = document.getElementById("mesa").value;

document.querySelectorAll(".item input").forEach(input => {

const qtd = parseInt(input.value);
const preco = parseFloat(input.dataset.preco);

if(qtd > 0){
total += preco * qtd;
lista += `<li>${input.dataset.nome} x${qtd}</li>`;
}

});

document.getElementById("total").textContent = total.toFixed(2);
document.getElementById("pedidoCliente").textContent = nome;
document.getElementById("pedidoMesa").textContent = mesa;
document.getElementById("listaPedido").innerHTML = lista;
}

// ================= BOTÕES =================
document.addEventListener("click",(e)=>{

if(e.target.classList.contains("mais")){
const input = e.target.parentElement.querySelector("input");
input.value++;
calcularTotal();
}

if(e.target.classList.contains("menos")){
const input = e.target.parentElement.querySelector("input");
if(input.value > 0){
input.value--;
calcularTotal();
}
}

});

// ================= ENVIAR PEDIDO =================
async function enviarPedido(){

const nome = document.getElementById("nm").value;
const mesa = document.getElementById("mesa").value;

if(!nome || !mesa){
alert("Preencha nome e mesa!");
return;
}

let itens = [];
let total = 0;

document.querySelectorAll(".item input").forEach(input => {

const qtd = parseInt(input.value);
const preco = parseFloat(input.dataset.preco);

if(qtd > 0){
itens.push({
nome: input.dataset.nome,
qtd: qtd
});
total += preco * qtd;
}

});

if(itens.length === 0){
alert("Adicione itens!");
return;
}

await addDoc(collection(db, "pedidos"), {
cliente: nome,
mesa: mesa,
itens,
total,
data: new Date().toLocaleString(),
novo: true
});

alert("Pedido enviado!");

// limpar
document.querySelectorAll(".item input").forEach(i => i.value = 0);
calcularTotal();
}

document.getElementById("btnEnviar").addEventListener("click", enviarPedido);

// ================= TEMPO REAL =================
onSnapshot(collection(db, "esgotados"), (snapshot) => {

let lista = [];

snapshot.forEach(doc => {
lista.push(doc.data().nome);
});

aplicarEsgotados(lista);

});

// ================= FUNÇÃO FINAL =================
function aplicarEsgotados(lista){

document.querySelectorAll(".item").forEach(item => {

const nome = normalizar(item.querySelector("span").textContent);
const botoes = item.querySelectorAll("button");
const input = item.querySelector("input");
const info = item.querySelector(".info");

let aviso = item.querySelector(".esgotado-label");

if(lista.includes(nome)){

if(!aviso){
aviso = document.createElement("p");
aviso.textContent = "ESGOTADO";
aviso.style.color = "red";
aviso.style.fontWeight = "bold";
info.appendChild(aviso);
}

botoes.forEach(b => b.disabled = true);
input.value = 0;
item.style.opacity = "0.5";

}else{

if(aviso) aviso.remove();

botoes.forEach(b => b.disabled = false);
item.style.opacity = "1";

}

});

calcularTotal();
}