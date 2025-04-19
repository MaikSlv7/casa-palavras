
let palavras = [];
let gridSize = (nivel === 'dificil') ? 16 : 12;
let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let direcoes = [[1, 0], [0, 1], [1, 1], [-1, 1]];
let grade = [], palavrasEncontradas = 0, cronometroAtivo = false, segundos = 0, intervalo;
let selecionando = false, selecaoAtual = "", posicoesSelecionadas = [], palavrasJaEncontradas = new Set();

const audioClick = new Audio('click.wav');
const audioDing = new Audio('ding.wav');

function iniciarJogo() {
  const nivel = document.querySelector('input[name=nivel]:checked').value;
  const palavrasPorNivel = {
    facil: ["SOL", "LUA", "MAR", "CÉU"],
    medio: ["NATUREZA", "VIAGEM", "ESCOLA", "PESSOAL", "COMIDA", "ANIMAL"],
    dificil: ["COMPUTADOR", "DESENVOLVEDOR", "ENGENHARIA", "EDUCACAO", "FUNDAMENTAL", "EXPERIENCIA", "INICIATIVA", "PROGRAMAÇÃO"]
  };
  palavras = palavrasPorNivel[nivel];
  palavrasEncontradas = 0;
  palavrasJaEncontradas.clear();
  selecaoAtual = "";
  posicoesSelecionadas = [];
  document.getElementById("word-grid").innerHTML = "";
  gridSize = (nivel === 'dificil') ? 16 : 12;
  grade = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
  gerarGrade();
  gerarTabuleiro();
  atualizarPlacar();
  segundos = 0;
  document.getElementById('cronometro').textContent = "⏱️ 00:00";
  clearInterval(intervalo);
  cronometroAtivo = false;
}

function startCronometro() {
  if (!cronometroAtivo) {
    cronometroAtivo = true;
    intervalo = setInterval(() => {
      segundos++;
      const min = String(Math.floor(segundos / 60)).padStart(2, '0');
      const sec = String(segundos % 60).padStart(2, '0');
      document.getElementById('cronometro').textContent = `⏱️ ${min}:${sec}`;
    }, 1000);
  }
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas} / ${palavras.length} palavras`;
}

function inserirPalavra(palavra) {
  let colocada = false, tentativas = 0;
  while (!colocada && tentativas < 100) {
    tentativas++;
    const [dx, dy] = direcoes[Math.floor(Math.random() * direcoes.length)];
    const maxX = dx === 1 ? gridSize - palavra.length : dx === -1 ? palavra.length - 1 : gridSize - 1;
    const maxY = dy === 1 ? gridSize - palavra.length : gridSize - 1;
    const startX = Math.floor(Math.random() * (maxX + 1));
    const startY = Math.floor(Math.random() * (maxY + 1));
    let podeInserir = true;
    for (let i = 0; i < palavra.length; i++) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      const atual = grade[y][x];
      if (atual !== "" && atual !== palavra[i]) {
        podeInserir = false;
        break;
      }
    }
    if (podeInserir) {
      for (let i = 0; i < palavra.length; i++) {
        const x = startX + dx * i;
        const y = startY + dy * i;
        grade[y][x] = palavra[i];
      }
      colocada = true;
    }
  }
}

function gerarGrade() {
  palavras.forEach(p => inserirPalavra(p));
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grade[y][x] === "") {
        grade[y][x] = letras[Math.floor(Math.random() * letras.length)];
      }
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
      div.dataset.x = x;
      div.dataset.y = y;

      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startCronometro();
        selecionando = true;
        selecionarLetra(div);
      });
      div.addEventListener("mouseover", () => {
        if (selecionando) selecionarLetra(div);
      });
      document.addEventListener("mouseup", () => {
        if (selecionando) verificarPalavraSelecionada();
      });
      div.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startCronometro();
        selecionarLetra(div);
        selecionando = true;
      });
      div.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.classList.contains("letter") && selecionando) {
          selecionarLetra(el);
        }
      });
      div.addEventListener("touchend", () => {
        if (selecionando) verificarPalavraSelecionada();
      });

      container.appendChild(div);
    }
  }
}

function selecionarLetra(div) {
  if (!div.classList.contains("selected")) {
    div.classList.add("selected");
    selecaoAtual += div.textContent;
    posicoesSelecionadas.push(div);
    audioClick.currentTime = 0;
    audioClick.play();
  }
}

function verificarPalavraSelecionada() {
  const palavraFormada = selecaoAtual;
  if (palavras.includes(palavraFormada) && !palavrasJaEncontradas.has(palavraFormada)) {
    posicoesSelecionadas.forEach(div => div.classList.add("found"));
    palavrasEncontradas++;
    palavrasJaEncontradas.add(palavraFormada);
    atualizarPlacar();
    audioDing.currentTime = 0;
    audioDing.play();
  } else {
    posicoesSelecionadas.forEach(div => div.classList.remove("selected"));
  }
  selecaoAtual = "";
  posicoesSelecionadas = [];
  selecionando = false;
}
