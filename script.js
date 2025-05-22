
// =================== Variáveis Globais ===================
let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let tempoRestante = 0;
let intervalo;
let faseAtual = 1;
const totalFases = 5;
const categorias = {
  frutas: ["BANANA", "MAÇA", "PERA", "UVA", "LARANJA", "MELANCIA"],
  animais: ["CACHORRO", "GATO", "ELEFANTE", "LEAO", "TIGRE", "URSO"],
  cores: ["VERMELHO", "AZUL", "VERDE", "AMARELO", "ROXO", "LILAS"]
};

// =================== Configuração de Fase ===================
function configurarFase() {
  return {
    tamanho: 8 + (faseAtual - 1) * 2,
    tempo: 300 - (faseAtual - 1) * 60,
    numPalavras: 4 + (faseAtual - 1)
  };
}

function avancarFase() {
  if (faseAtual < totalFases) {
    faseAtual++;
    alert(`✅ Parabéns! Avançando para a Fase ${faseAtual}...`);
    iniciarJogo();
  } else {
    alert("🏆 Parabéns, você completou todas as fases!");
    faseAtual = 1;
    iniciarJogo();
  }
}

// =================== Funções principais ===================
window.selecionarCategoria = function() {
  const categoria = document.getElementById("categoria").value;
  palavras = categorias[categoria] || Object.values(categorias).flat();
  atualizarListaPalavras();
};

window.gerarPalavrasAleatorias = function() {
  palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
};

window.iniciarJogo = function() {
  const config = configurarFase();
  const tamanho = config.tamanho;
  const numPalavras = config.numPalavras;

  const grid = document.getElementById("word-grid");
  if (!grid) { console.error("Elemento #word-grid não encontrado."); return; }

  palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, numPalavras);
  atualizarListaPalavras();

  palavrasEncontradas = [];
  atualizarPlacar();

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
  const grade = gerarGrade(tamanho, tamanho, palavras);

  for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < tamanho; j++) {
      const div = document.createElement("div");
      div.className = "letter";
      div.textContent = grade[i][j] || "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
      div.onmousedown = (e) => iniciarSelecao(e, div);
      div.onmouseover = (e) => continuarSelecao(e, div);
      div.onmouseup = () => finalizarSelecao();
      div.ontouchstart = (e) => iniciarSelecao(e, div);
      div.ontouchmove = (e) => continuarSelecao(e, div);
      div.ontouchend = () => finalizarSelecao();
      grid.appendChild(div);
    }
  }

  iniciarCronometro(config.tempo);
};

// =================== Gerador de Grade ===================
function gerarGrade(linhas, colunas, palavras) {
  let grade = Array.from({ length: linhas }, () => Array(colunas).fill(""));
  palavras.forEach(palavra => {
    let colocado = false;
    for (let tentativa = 0; tentativa < 100 && !colocado; tentativa++) {
      const horizontal = Math.random() > 0.5;
      const x = Math.floor(Math.random() * (horizontal ? linhas : linhas - palavra.length));
      const y = Math.floor(Math.random() * (horizontal ? colunas - palavra.length : colunas));
      let cabe = true;
      for (let i = 0; i < palavra.length; i++) {
        const letra = horizontal ? grade[x][y + i] : grade[x + i][y];
        if (letra && letra !== palavra[i]) { cabe = false; break; }
      }
      if (cabe) {
        for (let i = 0; i < palavra.length; i++) {
          if (horizontal) grade[x][y + i] = palavra[i];
          else grade[x + i][y] = palavra[i];
        }
        colocado = true;
      }
    }
  });
  return grade;
}

// =================== Seleção de Letras ===================
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
    atualizarListaPalavras();
    if (palavrasEncontradas.length === palavras.length) {
      clearInterval(intervalo);
      avancarFase();
    }
  }
  document.querySelectorAll(".letter.selected").forEach(el => el.classList.remove("selected"));
  selecionando = false;
  selecaoAtual = "";
}

// =================== Cronômetro ===================
function iniciarCronometro(tempo) {
  clearInterval(intervalo);
  tempoRestante = tempo;
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

// =================== Atualização Visual ===================
function atualizarListaPalavras() {
  const span = document.getElementById("lista-palavras-span");
  const overlay = document.getElementById("lista-palavras-span-overlay");
  span.innerHTML = "";
  overlay.innerHTML = "";
  palavras.forEach(palavra => {
    const riscada = palavrasEncontradas.includes(palavra);
    const spanPalavra = document.createElement("span");
    spanPalavra.textContent = palavra;
    if (riscada) spanPalavra.style.textDecoration = "line-through";
    spanPalavra.style.marginRight = "8px";
    const clone = spanPalavra.cloneNode(true);
    span.appendChild(spanPalavra);
    overlay.appendChild(clone);
  });
}

function atualizarPlacar() {
  document.getElementById("progresso").textContent = `🔎 ${palavrasEncontradas.length} / ${palavras.length}`;
}

function fecharMenu() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
}

function reexibirMenu() {
  document.getElementById("menu-lateral").classList.remove("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "none";
  clearInterval(intervalo);
}