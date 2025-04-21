

// Enviar para ranking online com nome do jogador
function encerrarJogoOnline(nivel, pontos) {
  const nome = document.getElementById("nome-jogador")?.value || "Anônimo";
  enviarPontuacaoOnline(nome, nivel, pontos);
  carregarRankingOnline();
}



// Gerar palavras aleatórias entre 6 e 10
function gerarPalavrasAleatorias() {
  const todas = ['SOL', 'LUA', 'MAR', 'ANIMAL', 'CACHORRO', 'ESCOLA', 'COMIDA', 'FRUTA', 'VIAGEM', 'PAZ', 'GUERRA', 'FUTEBOL', 'AMOR', 'ALEGRIA', 'TRISTEZA', 'CIDADE', 'FLORESTA', 'CARRO', 'AVIAO', 'NAVIO', 'BRASIL', 'FESTA', 'CIENCIA'];
  const quantidade = Math.floor(Math.random() * 5) + 6;
  palavras = [];

  while (palavras.length < quantidade) {
    const sorteada = todas[Math.floor(Math.random() * todas.length)];
    if (!palavras.includes(sorteada)) {
      palavras.push(sorteada);
    }
  }

  atualizarListaPalavras();
  alert("Palavras aleatórias geradas! Clique em 'Iniciar Jogo' para jogar.");
}
