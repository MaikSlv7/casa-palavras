
let palavras = [];
let gridSize = 12;
let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let grade = [], tempoRestante = 0, intervalo;
let selecionando = false, selecaoAtual = "", posicoesSelecionadas = [], palavrasEncontradas = 0;
let palavrasJaEncontradas = new Set(), pontuacao = 0;

const audioClick = new Audio('click.wav');
const audioDing = new Audio('ding.wav');
const audioErro = new Audio('erro.wav');
const audioTempo = new Audio('tempo.wav');

function iniciarJogo() {
  const nivel = document.querySelector('input[name=nivel]:checked').value;
  gridSize = (nivel === 'dificil') ? 16 : 12;

  palavrasEncontradas = 0;
  pontuacao = 0;
  palavrasJaEncontradas.clear();
  selecaoAtual = "";
  posicoesSelecionadas = [];

  const grid = document.getElementById("word-grid");
  grid.innerHTML = "";
  grid.className = (gridSize === 16) ? "grid-16" : "";

  grade = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
  const palavrasPorNivel = {
    facil: ["SOL", "LUA", "MAR", "CÉU"],
    medio: ["NATUREZA", "VIAGEM", "ESCOLA", "PESSOAL"],
    dificil: ["COMPUTADOR", "ENGENHEIRO", "PROGRAMACAO", "EDUCACAO"]
  };

  if (palavras.length === 0) {
    palavras = palavrasPorNivel[nivel];
  }

  gerarGrade();
  gerarTabuleiro();
  atualizarPlacar();
  document.getElementById("menu-lateral").style.display = "none";
  document.getElementById("botao-reabrir-menu").style.display = "block";

  const tempoPorNivel = { facil: 300, medio: 240, dificil: 180 };
  tempoRestante = tempoPorNivel[nivel];
  atualizarCronometro();
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0) {
      encerrarJogo(nivel);
    }
  }, 1000);
}

function atualizarCronometro() {
  const min = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
  const sec = String(tempoRestante % 60).padStart(2, '0');
  document.getElementById('cronometro').textContent = `⏱️ ${min}:${sec}`;
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas} / ${palavras.length} palavras`;
}

function gerarGrade() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      grade[y][x] = letras[Math.floor(Math.random() * letras.length)];
    }
  }
}

function gerarTabuleiro() {
  const container = document.getElementById("word-grid");
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const div = document.createElement("div");
      div.className = "letter";
      div.textContent = grade[y][x];
      container.appendChild(div);
    }
  }
}

function limparHistorico() {
  document.getElementById("historico").innerHTML = "";
}
