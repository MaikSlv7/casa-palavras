
// Conteúdo anterior omitido para brevidade...

function iniciarJogo() {
  if (document.getElementById("botao-reabrir-menu")) {
    document.getElementById("botao-reabrir-menu").style.display = "block";
  }
  const nivel = document.querySelector('input[name=nivel]:checked').value;
  gridSize = (nivel === 'dificil') ? 16 : 12;

  palavrasEncontradas = 0;
  pontuacao = 0;
  palavrasJaEncontradas.clear();
  selecaoAtual = "";
  posicoesSelecionadas = [];

  const grid = document.getElementById("word-grid");
  grid.innerHTML = "";
  grid.className = (gridSize === 16) ? "grid-16" : "";

  grade = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

  const palavrasPorNivel = {
    facil: ["SOL", "LUA", "MAR", "CÉU"],
    medio: ["NATUREZA", "VIAGEM", "ESCOLA", "PESSOAL", "COMIDA", "ANIMAL"],
    dificil: ["COMPUTADOR", "DESENVOLVEDOR", "ENGENHARIA", "EDUCACAO", "FUNDAMENTAL", "EXPERIENCIA", "INICIATIVA", "PROGRAMAÇÃO"]
  };

  if (palavras.length === 0) {
    palavras = palavrasPorNivel[nivel];
  }

  gerarGrade();
  gerarTabuleiro();
  atualizarPlacar();
  document.getElementById("menu-lateral").style.display = "none";
  document.getElementById("botao-reabrir-menu").style.display = "block";
  document.getElementById("botao-reabrir-menu").style.display = "block";

  const tempoPorNivel = { facil: 300, medio: 240, dificil: 180 };
  tempoRestante = tempoPorNivel[nivel];
  atualizarCronometro();
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0) {
      encerrarJogo(nivel);
    }
  }, 1000);
}
