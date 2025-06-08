let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let tempoRestante = 0;
let intervalo = null;

let modoAtual = "categorias";  // categorias ou fases
let faseAtual = 1;
let tamanhoTabuleiro = 8;
let quantidadePalavras = 3;

const categorias = {
  frutas: ["MACA", "BANANA", "UVA", "KIWI"],
  animais: ["GATO", "LEAO", "ZEBRA", "TUBARAO"],
  cores: ["AZUL", "VERMELHO", "VERDE", "AMARELO"]
};

window.selecionarModo = function(modo) {
  modoAtual = modo;
  if (modoAtual === "fases") {
    faseAtual = 1;
    tamanhoTabuleiro = 8;
    quantidadePalavras = 3;
    palavras = gerarPalavrasAleatorias(quantidadePalavras);
  } else {
    const categoria = document.getElementById("categoria").value;
    palavras = categoria && categorias[categoria] ? [...categorias[categoria]] : [];
  }
  iniciarJogo();
};

window.gerarNovasPalavras = function() {
  palavras = gerarPalavrasAleatorias(quantidadePalavras);
  iniciarJogo();
};

function iniciarJogo() {
  palavrasEncontradas = [];
  const tabuleiro = document.getElementById("word-grid");
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoTabuleiro}, 1fr)`;
  tabuleiro.innerHTML = '';

  const grade = [];
  for (let y = 0; y < tamanhoTabuleiro; y++) {
    grade[y] = [];
    for (let x = 0; x < tamanhoTabuleiro; x++) {
      grade[y][x] = gerarLetraAleatoria();
    }
  }

  posicionarPalavrasNoTabuleiro(grade);

  for (let y = 0; y < tamanhoTabuleiro; y++) {
    for (let x = 0; x < tamanhoTabuleiro; x++) {
      const celula = document.createElement('div');
      celula.classList.add('letter');
      celula.textContent = grade[y][x];
      celula.addEventListener('click', () => selecionarCelula(celula));
      tabuleiro.appendChild(celula);
    }
  }

  exibirPalavras();
}

function gerarLetraAleatoria() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letras[Math.floor(Math.random() * letras.length)];
}

function gerarPalavraAleatoria() {
  const comprimento = Math.floor(Math.random() * 5) + 3; // 3 a 7 letras
  let palavra = "";
  for (let i = 0; i < comprimento; i++) {
    palavra += gerarLetraAleatoria();
  }
  return palavra;
}

function gerarPalavrasAleatorias(qtd) {
  const lista = [];
  for (let i = 0; i < qtd; i++) {
    lista.push(gerarPalavraAleatoria());
  }
  return lista;
}

function posicionarPalavrasNoTabuleiro(grade) {
  const direcoes = [
    { x: 1, y: 0 },   // horizontal
    { x: 0, y: 1 },   // vertical
    { x: 1, y: 1 }    // diagonal
  ];

  const ocupado = Array.from({ length: tamanhoTabuleiro }, () =>
    Array(tamanhoTabuleiro).fill(null)
  );

  for (const palavra of palavras) {
    let colocado = false;
    for (let tentativa = 0; tentativa < 100 && !colocado; tentativa++) {
      const dir = direcoes[Math.floor(Math.random() * direcoes.length)];

      const maxX = tamanhoTabuleiro - (dir.x ? palavra.length : 1);
      const maxY = tamanhoTabuleiro - (dir.y ? palavra.length : 1);
      const inicioX = Math.floor(Math.random() * (maxX + 1));
      const inicioY = Math.floor(Math.random() * (maxY + 1));

      let valido = true;
      for (let k = 0; k < palavra.length; k++) {
        const x = inicioX + dir.x * k;
        const y = inicioY + dir.y * k;
        if (ocupado[y][x] && ocupado[y][x] !== palavra[k]) {
          valido = false;
          break;
        }
      }

      if (!valido) continue;

      for (let k = 0; k < palavra.length; k++) {
        const x = inicioX + dir.x * k;
        const y = inicioY + dir.y * k;
        grade[y][x] = palavra[k];
        ocupado[y][x] = palavra[k];
      }
      colocado = true;
    }
  }
}

function exibirPalavras() {
  const lista = document.getElementById('palavras');
  if (lista) {
    lista.innerHTML = 'Encontre: ' + palavras.join(', ');
  }
  const spanMenu = document.getElementById('lista-palavras-span');
  if (spanMenu) {
    spanMenu.textContent = palavras.join(', ');
  }
  const spanOverlay = document.getElementById('lista-palavras-span-overlay');
  if (spanOverlay) {
    spanOverlay.textContent = palavras.join(', ');
  }
}

function selecionarCelula(celula) {
  celula.classList.toggle('selected');
}

function avancarFase() {
  if (modoAtual === "fases") {
    faseAtual++;
    if (tamanhoTabuleiro < 16) tamanhoTabuleiro++;
    if (quantidadePalavras < 16) quantidadePalavras++;
    palavras = gerarPalavrasAleatorias(quantidadePalavras);
    iniciarJogo();
  }
}

function selecionarCategoria() {
  selecionarModo('categorias');
}

window.fecharMenu = function() {
  const menu = document.getElementById('menu-lateral');
  menu.classList.add('oculto');
  const btn = document.getElementById('botao-reabrir-menu');
  if (btn) btn.style.display = 'block';
  const overlay = document.getElementById('lista-palavras-overlay');
  if (overlay) overlay.style.display = 'block';
};

window.reexibirMenu = function() {
  const menu = document.getElementById('menu-lateral');
  menu.classList.remove('oculto');
  const btn = document.getElementById('botao-reabrir-menu');
  if (btn) btn.style.display = 'none';
  const overlay = document.getElementById('lista-palavras-overlay');
  if (overlay) overlay.style.display = 'none';
};
