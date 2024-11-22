let minaUsadaJogador1 = false;
let minaUsadaJogador2 = false;

// Função para comprar uma mina
const comprarMina = (jogador) => {
  if (jogador === 1 && dinheiroJogador1 >= 10) {
    dinheiroJogador1 -= 10;
    inventarioJogador1.push({ nome: "Mina", preco: 10, tipo: "mina" });
  } else if (jogador === 2 && dinheiroJogador2 >= 50) {
    dinheiroJogador2 -= 50;
    inventarioJogador2.push({ nome: "Mina", preco: 50, tipo: "mina" });
  }
  atualizarTabuleiro();
};

// Função para usar a mina do inventário
const usarMina = (jogador) => {
  if (jogador === 1 && !minaUsadaJogador1 && inventarioJogador1.some(item => item.tipo === "mina")) {
    // Remover a mina do inventário
    const minaIndex = inventarioJogador1.findIndex(item => item.tipo === "mina");
    inventarioJogador1.splice(minaIndex, 1);

    // Colocar a mina no tabuleiro de Jogador 1
    const index = obterPosicaoAleatoriaTabuleiro(tabuleiroJogador1);
    tabuleiroJogador1[index].classList.add("mina");
    minaUsadaJogador1 = true;
    atualizarTabuleiro();
  } else if (jogador === 2 && !minaUsadaJogador2 && inventarioJogador2.some(item => item.tipo === "mina")) {
    // Remover a mina do inventário
    const minaIndex = inventarioJogador2.findIndex(item => item.tipo === "mina");
    inventarioJogador2.splice(minaIndex, 1);

    // Colocar a mina no tabuleiro de Jogador 2
    const index = obterPosicaoAleatoriaTabuleiro(tabuleiroJogador2);
    tabuleiroJogador2[index].classList.add("mina");
    minaUsadaJogador2 = true;
    atualizarTabuleiro();
  }
};

// Função que retorna uma posição aleatória não clicada no tabuleiro
const obterPosicaoAleatoriaTabuleiro = (tabuleiro) => {
  let index;
  do {
    index = Math.floor(Math.random() * tabuleiro.length);
  } while (tabuleiro[index].classList.contains("acertou") || tabuleiro[index].classList.contains("mina"));
  return index;
};

// Função que será chamada quando um jogador clicar no tabuleiro do outro
const ativarMina = (e, jogadorAtacante, jogadorDefensor) => {
  if (e.target.classList.contains("mina")) {
    if (jogadorAtacante === 1) {
      minaUsadaJogador2 = false;
      mensagem.textContent = "Jogador 1 ativou uma mina! Jogador 2 perdeu a vez!";
    } else if (jogadorAtacante === 2) {
      minaUsadaJogador1 = false;
      mensagem.textContent = "Jogador 2 ativou uma mina! Jogador 1 perdeu a vez!";
    }
  }
};

// Atualiza o tabuleiro visualmente
const atualizarTabuleiro = () => {
  // Atualiza o tabuleiro de acordo com as alterações no estado do jogo
  const tabuleiro1 = document.getElementById("tabuleiro-jogador1");
  const tabuleiro2 = document.getElementById("tabuleiro-jogador2");

  // Limpa os tabuleiros
  tabuleiro1.innerHTML = "";
  tabuleiro2.innerHTML = "";

  // Atualiza as células do tabuleiro de Jogador 1
  tabuleiroJogador1.forEach(celula => tabuleiro1.appendChild(celula));

  // Atualiza as células do tabuleiro de Jogador 2
  tabuleiroJogador2.forEach(celula => tabuleiro2.appendChild(celula));
};

// Adiciona o evento de clique nas células
const adicionarEventosTabuleiro = () => {
  tabuleiroJogador1.forEach(celula => {
    celula.addEventListener("click", (e) => ativarMina(e, 1, 2)); // Jogador 1 clicando no tabuleiro de Jogador 2
  });

  tabuleiroJogador2.forEach(celula => {
    celula.addEventListener("click", (e) => ativarMina(e, 2, 1)); // Jogador 2 clicando no tabuleiro de Jogador 1
  });
};

adicionarEventosTabuleiro();
