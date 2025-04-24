
let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let posicoesSelecionadas = [];
let tempoRestante = 0;
let intervalo;

const categorias = {
  frutas: ["MACA", "BANANA", "UVA", "KIWI", "ABACAXI"],
  animais: ["GATO", "CAO", "LEAO", "ZEBRA", "TUBARAO"],
  cores: ["AZUL", "VERMELHO", "VERDE", "AMARELO", "PRETO"],
  profissoes: ["MEDICO", "ENGENHEIRO", "PROFESSOR", "MOTORISTA", "ARTISTA"],
  paises: ["BRASIL", "FRANCA", "JAPAO", "EGITO", "CHINA"]
};

function selecionarCategoria() {
  const categoriaSelecionada = document.getElementById("categoria").value;
  palavras = categoriaSelecionada && categorias[categoriaSelecionada]
    ? [...categorias[categoriaSelecionada]]
    : gerarListaAleatoria();
  atualizarListaPalavras();
}

function gerarPalavrasAleatorias() {
  palavras = gerarListaAleatoria();
  atualizarListaPalavras();
}

function gerarListaAleatoria() {
  const todas = Object.values(categorias).flat();
  return todas.sort(() => 0.5 - Math.random()).slice(0, 5);
}

function atualizarListaPalavras() {
  document.getElementById("lista-palavras-span").textContent = palavras.join(" - ");
}

function iniciarJogo() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";

  const nivel = document.querySelector('input[name="nivel"]:checked').value;
  const tamanho = nivel === "facil" ? 10 : nivel === "medio" ? 12 : 16;
  const total = tamanho * tamanho;
  palavrasEncontradas = [];
  atualizarPlacar();

  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = document.getElementById("word-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;

  for (let i = 0; i < total; i++) {
    const letra = letras[Math.floor(Math.random() * letras.length)];
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letra;
    div.setAttribute("onmousedown", "iniciarSelecao(event, this.textContent)");
    div.setAttribute("onmouseover", "continuarSelecao(event, this.textContent)");
    div.setAttribute("onmouseup", "finalizarSelecao()");
    div.setAttribute("ontouchstart", "iniciarSelecao(event, this.textContent)");
    div.setAttribute("ontouchmove", "continuarSelecao(event, this.textContent)");
    div.setAttribute("ontouchend", "finalizarSelecao()");
    grid.appendChild(div);
  }

  // Cronômetro
  const tempoNivel = nivel === "facil" ? 300 : nivel === "medio" ? 240 : 180;
  tempoRestante = tempoNivel;
  atualizarCronometro();
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      alert("⏰ Tempo esgotado!");
    }
  }, 1000);
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas.length} / ${palavras.length}`;
}

function atualizarCronometro() {
  const min = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
  const sec = String(tempoRestante % 60).padStart(2, '0');
  document.getElementById("cronometro").textContent = `⏱️ ${min}:${sec}`;
}

function iniciarSelecao(event, letra) {
  selecionando = true;
  selecaoAtual = letra;
  posicoesSelecionadas = [];
  event.target.classList.add("selected");
}

function continuarSelecao(event, letra) {
  if (!selecionando) return;
  selecaoAtual += letra;
  event.target.classList.add("selected");
}

function finalizarSelecao() {
  verificarPalavra();
  selecionando = false;
  selecaoAtual = "";
  posicoesSelecionadas = [];
  document.querySelectorAll(".letter.selected").forEach(el => el.classList.remove("selected"));
}

function verificarPalavra() {
  const palavra = selecaoAtual.toUpperCase();
  if (palavras.includes(palavra) && !palavrasEncontradas.includes(palavra)) {
    palavrasEncontradas.push(palavra);
    document.querySelectorAll(".letter.selected").forEach(el => el.classList.add("found"));
    atualizarPlacar();
    if (palavrasEncontradas.length === palavras.length) {
      clearInterval(intervalo);
      alert("🎉 Parabéns! Você encontrou todas as palavras!");
    }
  }
}
