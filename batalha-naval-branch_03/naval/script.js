document.getElementById("iniciar-jogo").addEventListener("click", () => {
  const nomeJogador1 = document.getElementById("nome-jogador1").value || "Jogador 1";
  const nomeJogador2 = document.getElementById("nome-jogador2").value || "Jogador 2";

  // Define os nomes dos jogadores na interface do jogo
  document.getElementById("nome-exibido-jogador1").innerText = nomeJogador1;
  document.getElementById("nome-exibido-jogador2").innerText = nomeJogador2;

  // Esconde a tela de introdução e mostra a tela do jogo
  document.getElementById("introducao").style.display = "none";
  document.getElementById("tela-jogo").style.display = "block";
});

const tabuleiro1 = document.getElementById("tabuleiro-jogador1");
const tabuleiro2 = document.getElementById("tabuleiro-jogador2");
const mensagem = document.getElementById("mensagem");
const botaoTurno = document.getElementById("botao-turno");
const itensDisponiveisDiv = document.getElementById("itens-disponiveis");

let turno = 1;
let tabuleiroJogador1 = [];
let tabuleiroJogador2 = [];
let dinheiroJogador1 = 0;
let dinheiroJogador2 = 0;
const inventarioJogador1 = [];
const inventarioJogador2 = [];

// Itens disponíveis para compra (sem mina)
const itensDisponiveis = [
  { nome: "Mina", preco: 10 },
  { nome: "Cura", preco: 15 },
  { nome: "Bomba", preco: 20 },
  { nome: "Radar", preco: 25 },
  { nome: "Reforço", preco: 30 }
];

// Função para criar o tabuleiro visual e inicializar matrizes
function inicializarTabuleiro(tabuleiro, matriz, id) {
  for (let i = 0; i < 10; i++) {
    matriz[i] = [];
    for (let j = 0; j < 10; j++) {
      matriz[i][j] = "~";
      const celula = document.createElement("div");
      celula.classList.add("celula");
      celula.dataset.linha = i;
      celula.dataset.coluna = j;
      celula.addEventListener("click", () => atacar(id, i, j, celula));
      tabuleiro.appendChild(celula);
    }
  }
}

// Função para posicionar navios aleatoriamente no tabuleiro
function posicionarNavios(matriz) {
  const navios = [2, 3, 3, 4];
  navios.forEach(tamanho => {
    let colocado = false;
    while (!colocado) {
      const orientacao = Math.random() < 0.5 ? "H" : "V";
      const linha = Math.floor(Math.random() * 10);
      const coluna = Math.floor(Math.random() * 10);
      if (orientacao === "H" && coluna + tamanho <= 10 && matriz[linha].slice(coluna, coluna + tamanho).every(c => c === "~")) {
        for (let i = 0; i < tamanho; i++) matriz[linha][coluna + i] = "N";
        colocado = true;
      } else if (orientacao === "V" && linha + tamanho <= 10 && matriz.slice(linha, linha + tamanho).every(r => r[coluna] === "~")) {
        for (let i = 0; i < tamanho; i++) matriz[linha + i][coluna] = "N";
        colocado = true;
      }
    }
  });
}

// Função de ataque
function atacar(id, linha, coluna, celula) {
  if (id !== turno || celula.classList.contains("acertou") || celula.classList.contains("errou")) {
    return; // O jogador não pode atacar se não for sua vez ou se já clicou nessa célula
  }

  const tabuleiroAdversario = turno === 1 ? tabuleiroJogador2 : tabuleiroJogador1;

  if (tabuleiroAdversario[linha][coluna] === "N") {
    celula.classList.add("acertou");
    tabuleiroAdversario[linha][coluna] = "X";
    mensagem.innerText = "Acertou um navio!";
    adicionarDinheiro(turno, 10);
  } else if (tabuleiroAdversario[linha][coluna] === "~") {
    celula.classList.add("errou");
    tabuleiroAdversario[linha][coluna] = "O";
    mensagem.innerText = "Errou!";
  }

  verificarVitoria(tabuleiroAdversario);
  proximoTurno(); // Passa o turno após a ação do ataque
}

// Verifica se o jogador venceu
function verificarVitoria(tabuleiro) {
  if (tabuleiro.flat().every(c => c !== "N")) {
    mensagem.innerText = `Jogador ${turno} venceu!`;
    botaoTurno.disabled = true;
  }
}

// Função para passar o turno
function proximoTurno() {
  turno = turno === 1 ? 2 : 1;
  atualizarMensagemTurno();
}

// Atualiza a mensagem que indica de quem é a vez
function atualizarMensagemTurno() {
  mensagem.innerText = `É a vez do Jogador ${turno}.`;
}

// Adiciona dinheiro ao jogador após um ataque certo
function adicionarDinheiro(jogador, quantidade) {
  if (jogador === 1) {
    dinheiroJogador1 += quantidade;
    document.getElementById("dinheiro-jogador1").innerText = `Dinheiro: ${dinheiroJogador1}`;
  } else {
    dinheiroJogador2 += quantidade;
    document.getElementById("dinheiro-jogador2").innerText = `Dinheiro: ${dinheiroJogador2}`;
  }
}

// Função para comprar um item
function comprarItem(jogador, preco, item) {
  if (jogador === 1 && dinheiroJogador1 >= preco) {
    if (inventarioJogador1.length < 3) {
      dinheiroJogador1 -= preco;
      inventarioJogador1.push(item);
      document.getElementById("dinheiro-jogador1").innerText = `Dinheiro: ${dinheiroJogador1}`;
      atualizarInventario(1);
      mensagem.innerText = `Jogador 1 comprou ${item}!`;
    } else {
      mensagem.innerText = "Inventário do Jogador 1 cheio!";
    }
  } else if (jogador === 2 && dinheiroJogador2 >= preco) {
    if (inventarioJogador2.length < 3) {
      dinheiroJogador2 -= preco;
      inventarioJogador2.push(item);
      document.getElementById("dinheiro-jogador2").innerText = `Dinheiro: ${dinheiroJogador2}`;
      atualizarInventario(2);
      mensagem.innerText = `Jogador 2 comprou ${item}!`;
    } else {
      mensagem.innerText = "Inventário do Jogador 2 cheio!";
    }
  } else {
    mensagem.innerText = `Jogador ${jogador} não tem dinheiro suficiente!`;
  }
}

// Atualiza o inventário na interface
function atualizarInventario(jogador) {
  const inventarioDiv = document.getElementById(`inventario-jogador${jogador}`);
  inventarioDiv.innerHTML = '';
  const inventario = jogador === 1 ? inventarioJogador1 : inventarioJogador2;
  inventario.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerText = item;
    inventarioDiv.appendChild(itemDiv);
  });
}

// Cria o menu de compras
function criarMenuCompras() {
  itensDisponiveis.forEach(({ nome, preco }) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerText = `${nome} - ${preco} moedas`;
    itemDiv.style.cursor = "pointer";
    itemDiv.addEventListener("click", () => {
      comprarItem(turno, preco, nome);
    });
    itensDisponiveisDiv.appendChild(itemDiv);
  });
}

// Inicializa os tabuleiros e o menu de compras
inicializarTabuleiro(tabuleiro1, tabuleiroJogador2, 2);
inicializarTabuleiro(tabuleiro2, tabuleiroJogador1, 1);
posicionarNavios(tabuleiroJogador2);
posicionarNavios(tabuleiroJogador1);
criarMenuCompras();
atualizarMensagemTurno();
