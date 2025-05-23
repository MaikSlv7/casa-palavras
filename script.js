
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
}

function iniciarJogo() {
  palavrasEncontradas = [];
  const tabuleiro = document.getElementById("tabuleiro");
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanhoTabuleiro}, 1fr)`;
  tabuleiro.innerHTML = '';

  for (let i = 0; i < tamanhoTabuleiro * tamanhoTabuleiro; i++) {
    const celula = document.createElement('div');
    celula.classList.add('celula');
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
  lista.innerHTML = "Encontre: " + palavras.join(', ');
}

function selecionarCelula(celula) {
  celula.classList.toggle('selecionada');
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
