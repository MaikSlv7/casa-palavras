const gridSize = 10;
let palavras = ["HTML", "CSS", "JS", "WEB"];
const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const direcoes = [[1, 0], [0, 1], [1, 1], [-1, 1]];
let grade = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

let palavrasEncontradas = 0;
let cronometroAtivo = false;
let segundos = 0;
let intervalo;
let selecionando = false;
let selecaoAtual = "";
let posicoesSelecionadas = [];
let palavrasJaEncontradas = new Set();

const audioClick = new Audio('click.wav');
const audioDing = new Audio('ding.wav');

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

palavras.forEach(p => inserirPalavra(p));
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    if (grade[y][x] === "") {
      grade[y][x] = letras[Math.floor(Math.random() * letras.length)];
    }
  }
}

const container = document.getElementById("word-grid");

function verificarPalavraSelecionada() {
  const palavraFormada = selecaoAtual;
  if (palavras.includes(palavraFormada) && !palavrasJaEncontradas.has(palavraFormada)) {
    posicoesSelecionadas.forEach(div => div.classList.add("found"));
    palavrasEncontradas++;
    palavrasJaEncontradas.add(palavraFormada);
    atualizarPlacar();
    audioDing.play();
  } else {
    posicoesSelecionadas.forEach(div => div.classList.remove("selected"));
  }
  selecaoAtual = "";
  posicoesSelecionadas = [];
  selecionando = false;
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
      selecionando = true;
      selecionarLetra(div);
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

function mudarTema(tema) {
  document.body.className = "";
  document.body.classList.add(`tema-${tema}`);
}

atualizarPlacar();

const audioClick = new Audio('click.wav');
const audioDing = new Audio('ding.wav');

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
