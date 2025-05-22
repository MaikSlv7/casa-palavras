
let modoAtual = "";
let palavras = [];
let palavrasEncontradas = [];
let selecionando = false;
let selecaoAtual = "";
let tempoRestante = 0;
let intervalo;

const categorias = {
  frutas: ["BANANA", "MAÇA", "PERA", "UVA", "LARANJA", "MELANCIA"],
  animais: ["CACHORRO", "GATO", "ELEFANTE", "LEAO", "TIGRE", "CAVALO"]
};

function selecionarModo(modo) {
  modoAtual = modo;
  palavras = categorias[modo];
  document.getElementById('selecao-modo').style.display = 'none';
  iniciarJogo();
}

function iniciarJogo() {
  const tamanho = 10; // Tamanho fixo do tabuleiro
  const tabuleiro = document.getElementById('tabuleiro');
  
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
  
  tabuleiro.innerHTML = '';

  for (let i = 0; i < tamanho * tamanho; i++) {
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

function exibirPalavras() {
  const lista = document.getElementById('palavras');
  lista.innerHTML = "Encontre: " + palavras.join(', ');
}

function selecionarCelula(celula) {
  celula.classList.toggle('selecionada');
}
