import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ CORREÇÃO DO CAMINHO (IMPORTANTE)
import { app } from "/firebase/firebase.js";

const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");

  try{

    await signInWithEmailAndPassword(auth, email, senha);

    window.location.href = "/b/Loja/HTML/index.html";

  }catch(e){
    erro.textContent = "Email ou senha inválidos";
    console.error(e);
  }

});