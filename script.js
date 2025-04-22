
function iniciarJogo() {
  document.getElementById("menu-lateral").classList.add("oculto");
  document.getElementById("botao-reabrir-menu").style.display = "block";
  gerarTabuleiro();
}

function gerarTabuleiro() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const grid = document.getElementById("word-grid");
  grid.innerHTML = '';
  for (let i = 0; i < 144; i++) {
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letras[Math.floor(Math.random() * letras.length)];
    grid.appendChild(div);
  }
}
