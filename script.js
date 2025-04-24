
let palavras = [];

const categorias = {
  frutas: ["MACA", "BANANA", "UVA", "KIWI"],
  animais: ["GATO", "LEAO", "ZEBRA", "TUBARAO"],
  cores: ["AZUL", "VERMELHO", "VERDE", "AMARELO"]
};

function selecionarCategoria() {
  const categoria = document.getElementById("categoria").value;
  palavras = categoria && categorias[categoria] ? [...categorias[categoria]] : Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
}

function atualizarListaPalavras() {
  const texto = palavras.join(" - ");
  document.getElementById("lista-palavras-span").textContent = texto;
  document.getElementById("lista-palavras-span-overlay").textContent = texto;
}

function iniciarJogo() {
  const grid = document.getElementById("word-grid");
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  grid.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.className = "letter";
    div.textContent = letras[Math.floor(Math.random() * letras.length)];
    grid.appendChild(div);
  }
  atualizarListaPalavras();
}
