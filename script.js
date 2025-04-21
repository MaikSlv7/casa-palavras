
let palavras = [];
let gridSize = 12;
let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let direcoes = [[1, 0], [0, 1], [1, 1], [-1, 1]];
let grade = [], palavrasEncontradas = 0, tempoRestante = 0, intervalo;
let selecionando = false, selecaoAtual = "", posicoesSelecionadas = [], palavrasJaEncontradas = new Set();
let pontuacao = 0;

const audioClick = new Audio('click.wav');
const audioDing = new Audio('ding.wav');

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
    medio: ["NATUREZA", "VIAGEM", "ESCOLA", "PESSOAL", "COMIDA", "ANIMAL"],
    dificil: ["COMPUTADOR", "DESENVOLVEDOR", "ENGENHARIA", "EDUCACAO", "FUNDAMENTAL", "EXPERIENCIA", "INICIATIVA", "PROGRAMAÇÃO"]
  };

  if (palavras.length === 0) {
    palavras = palavrasPorNivel[nivel];
  }

  gerarGrade();
  gerarTabuleiro();
  atualizarPlacar();

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
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas} / ${palavras.length} palavras | 🎯 ${pontuacao} pontos`;
}

function encerrarJogo(nivel) {
  clearInterval(intervalo);
  const nome = document.getElementById("nome-jogador")?.value || "Anônimo";
  const mensagem = `🏁 Fim de jogo!\n\n✅ Palavras encontradas: ${palavrasEncontradas} de ${palavras.length}\n⏱️ Tempo restante: ${document.getElementById('cronometro').textContent.split(" ")[1]}\n🎯 Pontuação final: ${pontuacao}`;
  alert(mensagem);
  enviarPontuacaoOnline(nome, nivel, pontuacao);
  carregarRankingOnline();
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
  const nivel = document.querySelector('input[name=nivel]:checked').value;
  const pontosPorNivel = { facil: 10, medio: 20, dificil: 30 };
  if (palavras.includes(palavraFormada) && !palavrasJaEncontradas.has(palavraFormada)) {
    posicoesSelecionadas.forEach(div => div.classList.add("found"));
    palavrasEncontradas++;
    palavrasJaEncontradas.add(palavraFormada);
    pontuacao += pontosPorNivel[nivel];
    atualizarPlacar();
    audioDing.currentTime = 0;
    audioDing.play();
    if (palavrasEncontradas === palavras.length) {
      encerrarJogo(nivel);
    }
  } else {
    posicoesSelecionadas.forEach(div => div.classList.remove("selected"));
  }
  selecaoAtual = "";
  posicoesSelecionadas = [];
  selecionando = false;
}

function atualizarListaPalavras() {
  const span = document.getElementById("lista-palavras-span");
  span.innerHTML = palavras.map(p => `<span id="palavra-${p}">${p}</span>`).join(" - ");
  atualizarPlacar();
}

// Categorias
const categorias = {
  frutas: ["BANANA", "MAÇÃ", "UVA", "LARANJA", "MELANCIA", "MORANGO", "ABACAXI"],
  animais: ["CACHORRO", "GATO", "ELEFANTE", "LEÃO", "TIGRE", "ZEBRA", "CAVALO"],
  cores: ["VERMELHO", "AZUL", "AMARELO", "VERDE", "PRETO", "BRANCO", "ROSA"],
  profissoes: ["MÉDICO", "ENGENHEIRO", "PROFESSOR", "ADVOGADO", "PILOTO", "POLICIAL"],
  paises: ["BRASIL", "CANADÁ", "ARGENTINA", "ALEMANHA", "ITÁLIA", "JAPÃO", "CHINA"],
  ortografia: ["PALAVRA", "CEDILHA", "DÍGRAFO", "HÍFEN", "ACENTO", "VERBO", "PRONOME"],
  matematica: ["SOMA", "SUBTRAÇÃO", "FRAÇÃO", "NÚMERO", "MILHAR", "DECIMAL", "DIVISÃO"],
  ingles: ["APPLE", "DOG", "HOUSE", "COLOR", "WATER", "SCHOOL", "NUMBER"]
};

function selecionarCategoria() {
  const cat = document.getElementById("categoria").value;
  palavrasJaEncontradas.clear();
  if (categorias[cat]) {
    const todas = [...categorias[cat]];
    const quantidade = Math.floor(Math.random() * 6) + 5; // entre 5 e 10
    palavras = [];
    while (palavras.length < quantidade && todas.length > 0) {
      const index = Math.floor(Math.random() * todas.length);
      palavras.push(todas.splice(index, 1)[0]);
    }
    atualizarListaPalavras();
  }
}

function gerarPalavrasAleatorias() {
  const todas = ["SOL", "LUA", "MAR", "ANIMAL", "CACHORRO", "ESCOLA", "COMIDA", "FRUTA", "VIAGEM", "PAZ", "GUERRA", "FUTEBOL", "AMOR", "ALEGRIA", "TRISTEZA", "CIDADE", "FLORESTA", "CARRO", "AVIAO", "NAVIO", "BRASIL", "FESTA", "CIENCIA"];
  const quantidade = Math.floor(Math.random() * 5) + 6;
  palavras = [];

  while (palavras.length < quantidade) {
    const sorteada = todas[Math.floor(Math.random() * todas.length)];
    if (!palavras.includes(sorteada)) {
      palavras.push(sorteada);
    }
  }

  atualizarListaPalavras();
  alert("Palavras aleatórias geradas! Clique em 'Iniciar Jogo' para jogar.");
}

// Firebase
function enviarPontuacaoOnline(nome, nivel, pontos) {
  const dados = {
    nome: nome || "Anônimo",
    nivel,
    pontos,
    data: new Date().toLocaleString()
  };
  firebase.database().ref("ranking").push(dados);
}

function carregarRankingOnline() {
  const refRanking = firebase.database().ref("ranking").orderByChild("pontos").limitToLast(10);
  refRanking.once("value", snapshot => {
    const el = document.getElementById("ranking-global");
    if (!el) return;
    const dados = [];
    snapshot.forEach(child => {
      dados.push(child.val());
    });
    dados.reverse();
    el.innerHTML = "<strong>🌐 Ranking Global</strong><ol>" +
      dados.map(r => `<li>${r.nome} - ${r.pontos} pts (${r.nivel})</li>`).join("") +
      "</ol>";
  });
}
