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
  exibirPalavras();
};

function iniciarJogo() {
  palavrasEncontradas = [];
  const tabuleiro = document.getElementById("word-grid");
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoTabuleiro}, 1fr)`;
  tabuleiro.innerHTML = '';

  for (let i = 0; i < tamanhoTabuleiro * tamanhoTabuleiro; i++) {
    const celula = document.createElement('div');
    celula.classList.add('letter');
    celula.textContent = gerarLetraAleatoria();
    celula.addEventListener('click', () => selecionarCelula(celula));
    tabuleiro.appendChild(celula);
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
