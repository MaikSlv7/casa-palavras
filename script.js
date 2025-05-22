
let modoAtual = "";
let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let tempoRestante = 0;
let intervalo;
let faseAtual = 1;
let tamanhoTabuleiro = 8;
let quantidadePalavras = 3;

function selecionarModo(modo) {
  modoAtual = modo;
  if (modo === "fases") {
    faseAtual = 1;
    tamanhoTabuleiro = 8;
    quantidadePalavras = 3;
    palavras = gerarPalavrasAleatorias(quantidadePalavras);
  } else {
    palavras = categorias[modo];
  }
  document.getElementById('selecao-modo').style.display = 'none';
  iniciarJogo();
}

function iniciarJogo() {
  const tabuleiro = document.getElementById('tabuleiro');
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
  const comprimento = Math.floor(Math.random() * 5) + 3; // de 3 a 7 letras
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
    if (tamanhoTabuleiro < 16) {
      tamanhoTabuleiro++;
    }
    if (quantidadePalavras < 16) {
      quantidadePalavras++;
    }
    palavras = gerarPalavrasAleatorias(quantidadePalavras);
    iniciarJogo();
  }
}

const categorias = {
  frutas: ["BANANA", "MAÇA", "PERA", "UVA", "LARANJA", "MELANCIA"],
  animais: ["CACHORRO", "GATO", "ELEFANTE", "LEAO", "TIGRE", "CAVALO"]
};
