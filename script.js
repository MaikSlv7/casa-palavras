
let faseAtual = 1;

const temasPorFase = [
  { tema: "Frutas", palavras: ["MACA", "UVA", "BANANA", "KIWI"] },
  { tema: "Animais", palavras: ["GATO", "CAO", "LEAO", "ZEBRA", "TUBARAO"] },
  { tema: "Cores", palavras: ["AZUL", "VERMELHO", "VERDE", "ROSA", "AMARELO", "PRETO"] },
  { tema: "Profissões", palavras: ["MEDICO", "ENGENHEIRO", "PROFESSOR", "ADVOGADO", "ARTISTA", "MOTORISTA"] },
  { tema: "Países", palavras: ["BRASIL", "FRANCA", "JAPAO", "EGITO", "CANADA", "CHINA", "ITALIA"] }
];

function iniciarJogo() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
  document.getElementById("tela-transicao").style.display = "none";
  gerarTabuleiroPorFase(faseAtual);
  atualizarExibicaoFase();
}

function avancarFase() {
  faseAtual++;
  document.getElementById("tela-transicao").style.display = "none";
  iniciarJogo();
}

function concluirFase() {
  document.getElementById("tela-transicao").style.display = "flex";
  document.getElementById("texto-transicao").textContent = `🎉 Fase ${faseAtual} concluída! Prepare-se para a próxima...`;
}

function atualizarExibicaoFase() {
  const titulo = document.getElementById("fase-atual");
  const tema = temasPorFase[(faseAtual - 1) % temasPorFase.length].tema;
  titulo.textContent = `🗂️ Fase ${faseAtual} - Tema: ${tema}`;
}

function gerarTabuleiroPorFase(fase) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = document.getElementById("word-grid");
  grid.innerHTML = '';

  const tema = temasPorFase[(fase - 1) % temasPorFase.length];
  const palavras = tema.palavras;

  let total = fase <= 1 ? 100 : fase == 2 ? 144 : 256;
  const cols = fase <= 1 ? 10 : fase == 2 ? 12 : 16;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letras[Math.floor(Math.random() * letras.length)];
    grid.appendChild(div);
  }

  setTimeout(() => concluirFase(), 3000);
}
