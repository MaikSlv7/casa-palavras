
let palavras = [];

const categorias = {
  frutas: ["MACA", "BANANA", "UVA", "KIWI"],
  animais: ["GATO", "CACHORRO", "LEAO", "ZEBRA"],
  cores: ["AZUL", "VERMELHO", "VERDE", "AMARELO"],
  profissoes: ["MEDICO", "ENGENHEIRO", "PROFESSOR", "ARTISTA"],
  paises: ["BRASIL", "FRANCA", "JAPAO", "CHINA"]
};

function selecionarCategoria() {
  const categoria = document.getElementById("categoria").value;
  if (categorias[categoria]) {
    palavras = [...categorias[categoria]];
  } else {
    palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  }
  atualizarListaPalavras();
}

function gerarPalavrasAleatorias() {
  palavras = Object.values(categorias).flat().sort(() => 0.5 - Math.random()).slice(0, 5);
  atualizarListaPalavras();
}

function atualizarListaPalavras() {
  const lista = palavras.join(" - ");
  document.getElementById("lista-palavras-span").textContent = lista;
  const overlay = document.getElementById("lista-palavras-span-overlay");
  if (overlay) overlay.textContent = lista;
}
