let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let tempoRestante = 0;
let intervalo = null;

const categorias = {
  frutas: ["MACA", "BANANA", "UVA", "KIWI"],
  animais: ["GATO", "LEAO", "ZEBRA", "TUBARAO"],
  cores: ["AZUL", "VERMELHO", "VERDE", "AMARELO"]
};

function selecionarCategoria() {
  const categoria = document.getElementById("categoria").value;
  palavras = categoria && categorias[categoria] ? [...categorias[categoria]] :
    Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
}

function gerarPalavrasAleatorias() {
  palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
}

function atualizarListaPalavras() {
  const texto = palavras.join(" - ");
  document.getElementById("lista-palavras-span").textContent = texto;
  document.getElementById("lista-palavras-span-overlay").textContent = texto;
}

function iniciarJogo() {
  const grid = document.getElementById("word-grid");
  const nivel = document.querySelector('input[name="nivel"]:checked').value;
  const tamanho = nivel === "facil" ? 10 : nivel === "medio" ? 12 : 16;
  const total = tamanho * tamanho;
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  palavrasEncontradas = [];
  atualizarPlacar();

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;

  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letras[Math.floor(Math.random() * letras.length)];
    div.onmousedown = (e) => iniciarSelecao(e, div);
    div.onmouseover = (e) => continuarSelecao(e, div);
    div.onmouseup = () => finalizarSelecao();
    div.ontouchstart = (e) => iniciarSelecao(e, div);
    div.ontouchmove = (e) => continuarSelecao(e, div);
    div.ontouchend = () => finalizarSelecao();
    grid.appendChild(div);
  }

  iniciarCronometro(nivel);
}

function iniciarCronometro(nivel) {
  clearInterval(intervalo);
  tempoRestante = nivel === "facil" ? 300 : nivel === "medio" ? 240 : 180;
  atualizarCronometro();
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      alert("⏰ Tempo esgotado!");
    }
  }, 1000);
}

function atualizarCronometro() {
  const min = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
  const sec = String(tempoRestante % 60).padStart(2, '0');
  document.getElementById("cronometro").textContent = `⏱️ ${min}:${sec}`;
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas.length} / ${palavras.length}`;
}

function iniciarSelecao(event, el) {
  selecionando = true;
  selecaoAtual = el.textContent;
  el.classList.add("selected");
}

function continuarSelecao(event, el) {
  if (selecionando) {
    selecaoAtual += el.textContent;
    el.classList.add("selected");
  }
}

function finalizarSelecao() {
  const palavra = selecaoAtual.toUpperCase();
  if (palavras.includes(palavra) && !palavrasEncontradas.includes(palavra)) {
    palavrasEncontradas.push(palavra);
    document.querySelectorAll(".letter.selected").forEach(el => el.classList.add("found"));
    atualizarPlacar();
    if (palavrasEncontradas.length === palavras.length) {
      clearInterval(intervalo);
      alert("🎉 Você encontrou todas as palavras!");
    }
  }
  document.querySelectorAll(".letter.selected").forEach(el => el.classList.remove("selected"));
  selecionando = false;
  selecaoAtual = "";
}

function reexibirMenu() {
  document.getElementById("menu-lateral").classList.remove("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "none";
  clearInterval(intervalo);
}

function fecharMenu() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
}

document.getElementById("botao-iniciar").addEventListener("click", iniciarJogo);