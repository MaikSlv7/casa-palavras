
let faseAtual = 1;

function iniciarJogo() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
  gerarTabuleiroPorFase(faseAtual);
  atualizarExibicaoFase();
}

function avancarFase() {
  faseAtual++;
  iniciarJogo();
}

function atualizarExibicaoFase() {
  const titulo = document.getElementById("fase-atual");
  if (!titulo) return;
  let nome = "Fácil";
  if (faseAtual >= 2) nome = "Intermediário";
  if (faseAtual >= 3) nome = "Difícil";
  titulo.textContent = `🗂️ Fase ${faseAtual} - ${nome}`;
}

function gerarTabuleiroPorFase(fase) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = document.getElementById("word-grid");
  grid.innerHTML = '';
  let total = fase <= 1 ? 100 : fase == 2 ? 144 : 256;
  const cols = fase <= 1 ? 10 : fase == 2 ? 12 : 16;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letras[Math.floor(Math.random() * letras.length)];
    grid.appendChild(div);
  }
}
