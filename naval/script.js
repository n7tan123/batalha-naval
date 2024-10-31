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
let turnosPerdidosJogador1 = 0;
let turnosPerdidosJogador2 = 0;

// Itens disponíveis para compra
const itensDisponiveis = [
  { nome: "Cura", preco: 15 },
  { nome: "Bomba", preco: 20 },
  { nome: "Radar", preco: 25 },
  { nome: "Reforço", preco: 30 },
  { nome: "Mina", preco: 10 }
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
  if (turnosPerdidosJogador1 > 0 && id === 1) {
    turnosPerdidosJogador1--;
    mensagem.innerText = `Jogador 1 está perdendo um turno. ${turnosPerdidosJogador1} turnos restantes.`;
    return;
  }
  
  if (turnosPerdidosJogador2 > 0 && id === 2) {
    turnosPerdidosJogador2--;
    mensagem.innerText = `Jogador 2 está perdendo um turno. ${turnosPerdidosJogador2} turnos restantes.`;
    return;
  }

  const tabuleiro = id === 1 ? tabuleiroJogador2 : tabuleiroJogador1;

  // Verifica se o jogador clicou em uma mina
  if (tabuleiro[linha][coluna] === "M") {
    celula.classList.add("mina"); // Muda a cor da célula para amarelo
    mensagem.innerText = `Jogador ${id} clicou em uma mina! Você perdeu 2 turnos!`;
    // Aplica a penalização de turnos
    if (id === 1) {
      turnosPerdidosJogador1 += 2;
    } else {
      turnosPerdidosJogador2 += 2;
    }
    return;
  }

  // Verifica se o ataque acerta um navio
  if (tabuleiro[linha][coluna] === "N") {
    celula.classList.add("acertou");
    tabuleiro[linha][coluna] = "X"; // Marca a célula como atingida
    mensagem.innerText = "Acertou um navio!";
    adicionarDinheiro(id, 10); // Adiciona 10 moedas ao jogador
  } else {
    celula.classList.add("errou");
    tabuleiro[linha][coluna] = "O"; // Marca a célula como errada
    mensagem.innerText = "Errou!";
  }

  // Verifica se o jogador venceu
  if (tabuleiro.flat().every(c => c !== "N")) {
    mensagem.innerText = `Jogador ${id} venceu!`;
    botaoTurno.disabled = true;
  }
}

// Adiciona dinheiro ao jogador após um ataque certo
function adicionarDinheiro(jogador, quantidade) {
  if (jogador === 1) {
    dinheiroJogador1 += quantidade; // Adiciona a quantidade de dinheiro ao jogador 1
    document.getElementById("dinheiro-jogador1").innerText = `Dinheiro: ${dinheiroJogador1}`;
  } else {
    dinheiroJogador2 += quantidade; // Adiciona a quantidade de dinheiro ao jogador 2
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
  inventarioDiv.innerHTML = ''; // Limpa o inventário
  const inventario = jogador === 1 ? inventarioJogador1 : inventarioJogador2;
  inventario.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerText = item; // Adiciona o nome do item
    itemDiv.addEventListener("click", () => {
      if (item === "Mina") {
        usarMina(jogador); // Usa a mina se o jogador clicar nela
      }
    });
    inventarioDiv.appendChild(itemDiv);
  });
}

// Função para usar a mina do inventário
function usarMina(jogador) {
  const inventario = jogador === 1 ? inventarioJogador1 : inventarioJogador2;

  // Verifica se o jogador tem uma mina no inventário
  const minaIndex = inventario.indexOf("Mina");
  if (minaIndex !== -1) {
    // Remove a mina do inventário
    inventario.splice(minaIndex, 1);
    atualizarInventario(jogador);
    mensagem.innerText = `Jogador ${jogador} usou uma mina!`;

    // Tenta posicionar a mina no tabuleiro do adversário
    const adversario = jogador === 1 ? tabuleiroJogador2 : tabuleiroJogador1;
    posicionarMina(adversario);
  } else {
    mensagem.innerText = `Jogador ${jogador} não tem minas no inventário!`;
  }
}

// Função para posicionar a mina aleatoriamente no tabuleiro do adversário
function posicionarMina(matriz) {
  let posicionado = false;

  while (!posicionado) {
    const linha = Math.floor(Math.random() * 10);
    const coluna = Math.floor(Math.random() * 10);

    // Verifica se a célula está vazia e não foi clicada
    if (matriz[linha][coluna] === "~") {
      matriz[linha][coluna] = "M"; // Marca a célula como contendo uma mina
      posicionado = true;
    }
  }
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

// Alterna o turno dos jogadores
botaoTurno.addEventListener("click", () => {
  if (turnosPerdidosJogador1 > 0) {
    turnosPerdidosJogador1--;
    mensagem.innerText = `Jogador 1 está perdendo um turno. ${turnosPerdidosJogador1} turnos restantes.`;
    return;
  }
  
  if (turnosPerdidosJogador2 > 0) {
    turnosPerdidosJogador2--;
    mensagem.innerText = `Jogador 2 está perdendo um turno. ${turnosPerdidosJogador2} turnos restantes.`;
    return;
  }
  
  turno = turno === 1 ? 2 : 1;
  mensagem.innerText = `Turno do Jogador ${turno}`;
});

// Inicialização do Jogo
inicializarTabuleiro(tabuleiro1, tabuleiroJogador1, 1);
inicializarTabuleiro(tabuleiro2, tabuleiroJogador2, 2);
posicionarNavios(tabuleiroJogador1);
posicionarNavios(tabuleiroJogador2);
criarMenuCompras(); // Cria o menu de compras
mensagem.innerText = `Turno do Jogador ${turno}`;
