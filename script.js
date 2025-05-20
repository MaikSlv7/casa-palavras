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


window.iniciarJogo = function() {
  const grid = document.getElementById("word-grid");
  if (!grid) { console.error("Elemento #word-grid não encontrado."); return; }

  const nivel = document.querySelector('input[name="nivel"]:checked').value;
  const tamanho = nivel === "facil" ? 10 : nivel === "medio" ? 12 : 16;
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  palavrasEncontradas = [];
  atualizarPlacar();
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
  const linhas = tamanho;
  const colunas = tamanho;
  const grade = gerarGrade(linhas, colunas, palavras);

  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      const div = document.createElement("div");
      div.className = "letter";
      div.textContent = grade[i][j] || letras[Math.floor(Math.random() * letras.length)];
      div.onmousedown = (e) => iniciarSelecao(e, div);
      div.onmouseover = (e) => continuarSelecao(e, div);
      div.onmouseup = () => finalizarSelecao();
      div.ontouchstart = (e) => iniciarSelecao(e, div);
      div.ontouchmove = (e) => continuarSelecao(e, div);
      div.ontouchend = () => finalizarSelecao();
      grid.appendChild(div);
    }
  }

  iniciarCronometro(nivel);
};

window.gerarPalavrasAleatorias = function() {
  palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
};

window.selecionarCategoria = function() {
  const categoria = document.getElementById("categoria").value;
  palavras = categoria && categorias[categoria] ? [...categorias[categoria]] :
    Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
};

window.fecharMenu = function() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
};

window.reexibirMenu = function() {
  document.getElementById("menu-lateral").classList.remove("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "none";
  clearInterval(intervalo);
};

function atualizarListaPalavras() {
  const texto = palavras.join(" - ");
  document.getElementById("lista-palavras-span").textContent = texto;
  document.getElementById("lista-palavras-span-overlay").textContent = texto;
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas.length} / ${palavras.length}`;
}