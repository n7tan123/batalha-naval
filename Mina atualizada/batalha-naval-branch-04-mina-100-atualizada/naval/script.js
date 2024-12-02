// Captura a dificuldade da URL
const urlParams = new URLSearchParams(window.location.search);
const dificuldade = parseInt(urlParams.get('dificuldade')) || 10;  // Se não houver parâmetro, o valor padrão é 10 (Médio)
document.documentElement.style.setProperty('--tamanho-tabuleiro', dificuldade);


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
  // Limpa o tabuleiro antes de inicializar
  tabuleiro.innerHTML = "";

  // Define o tamanho das células de forma proporcional
  const tamanhoCelula = 100 / dificuldade; // Proporcional ao número de células (8x8, 10x10, ou 12x12)
  tabuleiro.style.gridTemplateColumns = `repeat(${dificuldade}, ${tamanhoCelula}%)`;
  tabuleiro.style.gridTemplateRows = `repeat(${dificuldade}, ${tamanhoCelula}%)`;

  // Inicializa as células do tabuleiro
  for (let i = 0; i < dificuldade; i++) {
    matriz[i] = [];
    for (let j = 0; j < dificuldade; j++) {
      matriz[i][j] = "~"; // Marca célula como vazio
      const celula = document.createElement("div");
      celula.classList.add("celula");
      celula.dataset.linha = i;
      celula.dataset.coluna = j;
      celula.dataset.tabuleiro = id;

      // Ações ao clicar na célula
      celula.addEventListener("click", () => {
        if (id === 1 && turno === 1) {
          atacar(1, i, j, celula);
        } else if (id === 2 && turno === 2) {
          atacar(2, i, j, celula);
        }
      });
      tabuleiro.appendChild(celula);
    }
  }
}

// Função para posicionar navios aleatoriamente no tabuleiro
function posicionarNavios(matriz) {
  const navios = [4, 3, 3, 2, 2, 2];  // Tamanhos dos navios: 1 de 4, 2 de 3, 3 de 2
  navios.forEach(tamanho => {
    let colocado = false;
    while (!colocado) {
      const orientacao = Math.random() < 0.5 ? "H" : "V";  // Orientação aleatória (Horizontal ou Vertical)
      const linha = Math.floor(Math.random() * dificuldade);  // Usando a dificuldade aqui para limitar a posição
      const coluna = Math.floor(Math.random() * dificuldade); // Usando a dificuldade aqui para limitar a posição

      // Tentando posicionar horizontalmente (H)
      if (orientacao === "H" && coluna + tamanho <= dificuldade && matriz[linha].slice(coluna, coluna + tamanho).every(c => c === "~")) {
        for (let i = 0; i < tamanho; i++) {
          matriz[linha][coluna + i] = "N";  // Marca o espaço ocupado pelo navio
        }
        colocado = true;  // Marca o barco como posicionado
      }
      // Tentando posicionar verticalmente (V)
      else if (orientacao === "V" && linha + tamanho <= dificuldade && matriz.slice(linha, linha + tamanho).every(r => r[coluna] === "~")) {
        for (let i = 0; i < tamanho; i++) {
          matriz[linha + i][coluna] = "N";  // Marca o espaço ocupado pelo navio
        }
        colocado = true;  // Marca o barco como posicionado
      }
    }
  });
}

// Função de ataque
// Função de ataque
function atacar(id, linha, coluna, celula) {
  // Verifica se o turno é do jogador que está tentando atacar
  if (turno !== id) {
    mensagem.innerText = `Não é a sua vez, Jogador ${id}!`;
    return;
  }

  const tabuleiroAdversario = id === 1 ? tabuleiroJogador2 : tabuleiroJogador1;

  // Verifica se o jogador está perdendo turnos
  if (id === 1 && turnosPerdidosJogador1 > 0) {
    turnosPerdidosJogador1--;
    mensagem.innerText = `Jogador 1 está perdendo um turno. ${turnosPerdidosJogador1} turnos restantes.`;
    return;
  }

  if (id === 2 && turnosPerdidosJogador2 > 0) {
    turnosPerdidosJogador2--;
    mensagem.innerText = `Jogador 2 está perdendo um turno. ${turnosPerdidosJogador2} turnos restantes.`;
    return;
  }

  // Verifica se o jogador clicou em uma mina
  if (tabuleiroAdversario[linha][coluna] === "M") {
    celula.classList.add("mina"); // Revela a mina ao jogador
    mensagem.innerText = `Jogador ${id} clicou em uma mina! Você perdeu 2 turnos!`;
    // Aplica a penalização de turnos
    if (id === 1) {
      turnosPerdidosJogador1 += 2;
    } else if (id === 2) {
      turnosPerdidosJogador2 += 2; // A penalização para o jogador 2
    }
    return;
  }

  // Verifica se o ataque acerta um navio
  if (tabuleiroAdversario[linha][coluna] === "N") {
    celula.classList.add("acertou");
    tabuleiroAdversario[linha][coluna] = "X"; // Marca a célula como atingida
    mensagem.innerText = "Acertou um navio!";
    adicionarDinheiro(id, 10); // Adiciona 10 moedas ao jogador
  } else {
    celula.classList.add("errou");
    tabuleiroAdversario[linha][coluna] = "O"; // Marca a célula como errada
    mensagem.innerText = "Errou!";
  }

  // Verifica se o jogador venceu
  if (tabuleiroAdversario.flat().every(c => c !== "N")) {
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

      // Se o item for "Reforço", adiciona a lógica para o jogador clicar e ativar
      if (item === "Reforço") {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.innerText = item;
        itemDiv.addEventListener("click", () => ativarReforcoJogador1()); // Ativar Reforço ao clicar
        document.getElementById("inventario-jogador1").appendChild(itemDiv);
      }
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

      // Se o item for "Reforço", adiciona a lógica para o jogador clicar e ativar
      if (item === "Reforço") {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.innerText = item;
        itemDiv.addEventListener("click", () => ativarReforcoJogador2()); // Ativar Reforço ao clicar
        document.getElementById("inventario-jogador2").appendChild(itemDiv);
      }
    } else {
      mensagem.innerText = "Inventário do Jogador 2 cheio!";
    }
  } else {
    mensagem.innerText = `Jogador ${jogador} não tem dinheiro suficiente!`;
  }
}

// Atualiza o inventário com todos os itens
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
      } else if (item === "Radar") {
        usarRadar(jogador); // Usa o Radar se o jogador clicar nele
      }
    });
    inventarioDiv.appendChild(itemDiv);
  });
}

// Função para usar o Radar
function usarRadar(jogador) {
  const adversario = jogador === 1 ? tabuleiroJogador2 : tabuleiroJogador1;

  // Verifica se o jogador tem Radar no inventário
  const radarIndex = (jogador === 1 ? inventarioJogador1 : inventarioJogador2).indexOf("Radar");
  if (radarIndex !== -1) {
    // Remove o Radar do inventário
    if (jogador === 1) {
      inventarioJogador1.splice(radarIndex, 1);
    } else {
      inventarioJogador2.splice(radarIndex, 1);
    }
    atualizarInventario(jogador); // Atualiza o inventário

    // Revela dois quadrados aleatórios do adversário
    for (let i = 0; i < 2; i++) {
      const celulaAleatoria = escolherCelulaAleatoria(adversario);
      if (celulaAleatoria) {
        const { linha, coluna } = celulaAleatoria;
        // Adiciona a classe "radar" para destacar o quadrado
        const celulaDiv = (jogador === 1 ? tabuleiro1 : tabuleiro2).querySelector(`[data-linha="${linha}"][data-coluna="${coluna}"]`);
        celulaDiv.classList.add("radar");
      }
    }
    mensagem.innerText = `Radar ativado! Revelados 2 quadrados do adversário.`;
  } else {
    mensagem.innerText = `Jogador ${jogador} não tem Radar no inventário!`;
  }
}

// Função para escolher um quadrado aleatório no tabuleiro adversário
function escolherCelulaAleatoria(tabuleiro) {
  const quadradosDisponiveis = [];

  // Verifica os quadrados que ainda não foram atingidos
  for (let i = 0; i < tabuleiro.length; i++) {
    for (let j = 0; j < tabuleiro[i].length; j++) {
      if (tabuleiro[i][j] === "~") {
        quadradosDisponiveis.push({ linha: i, coluna: j });
      }
    }
  }

  if (quadradosDisponiveis.length > 0) {
    const indiceAleatorio = Math.floor(Math.random() * quadradosDisponiveis.length);
    return quadradosDisponiveis[indiceAleatorio];
  }
  return null; // Se não houver quadrados disponíveis
}

let turnoJogador = 1; // 1 é o jogador 1, 2 é o jogador 2
let usandoReforco = false; // Para controlar se o jogador está usando o item Reforço

// Função para ativar o item Reforço
function usarItemReforco(jogador) {
  if (usandoReforco) {
    alert("Você já usou o Reforço neste turno!");
    return; // Impede usar o item mais de uma vez por turno
  }

  if (turno !== jogador) {
    alert("Agora não é o seu turno!");
    return;
  }

  // Marca que o jogador está usando o Reforço
  usandoReforco = true;
  alert("Você ativou o Reforço! Realize outro ataque imediatamente!");

  // Permite que o jogador realize outro ataque (acessar a função de ataque)
  mensagem.innerText = `Jogador ${jogador} pode atacar novamente!`;
}

// Exemplo de como usar o item Reforço:
function ativarReforcoJogador1() {
  usarItemReforco(1); // Jogador 1 usa o item
}

function ativarReforcoJogador2() {
  usarItemReforco(2); // Jogador 2 usa o item
}

// Função de ataque (pode ser adaptada conforme sua implementação)
function realizarAtaque(jogador) {
  if (!usandoReforco) {
    alert("Você não pode atacar sem usar o Reforço.");
    return;
  }

  // O jogador escolhe uma célula para atacar
  let linha = prompt("Escolha a linha (0-7): ");
  let coluna = prompt("Escolha a coluna (0-7): ");
  
  const tabuleiroAdversario = (jogador === 1) ? tabuleiroJogador2 : tabuleiroJogador1;

  // Verifica o ataque
  if (tabuleiroAdversario[linha][coluna] === "M") {
    alert("Você acertou uma mina!");
    // Realiza a ação de acertar (marcar no tabuleiro, etc.)
  } else if (tabuleiroAdversario[linha][coluna] === "N") {
    alert("Você acertou um navio!");
    // Realiza a ação de acertar um navio
  } else {
    alert("A célula está vazia!");
    // Ação para quando o ataque não atinge nada
  }

  // Agora, se o jogador usou o Reforço, ele pode atacar novamente
  let continuarAtaque = confirm("Deseja realizar outro ataque com o Reforço?");
  if (continuarAtaque) {
    realizarAtaque(jogador); // Permite outro ataque
  } else {
    alert("Você encerrou o uso do Reforço.");
    // Encerrar o uso do Reforço, passando o turno
    usandoReforco = false;
    turno = turno === 1 ? 2 : 1; // Passa o turno para o outro jogador
    mensagem.innerText = `Turno do Jogador ${turno}`;
  }
}

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
    const adversario = jogador === 1 ? tabuleiroJogador1 : tabuleiroJogador2;
    const celulasAdversario = jogador === 1 ? tabuleiro1 : tabuleiro2;

    posicionarMina(adversario, celulasAdversario); // Passa a referência do tabuleiro do adversário
    
    // Passa o turno automaticamente após usar a mina
    turno = turno === 1 ? 2 : 1; 
    mensagem.innerText = `Agora é o turno do Jogador ${turno}!`;  // Exibe a mudança de turno
  } else {
    mensagem.innerText = `Jogador ${jogador} não tem minas no inventário!`;
  }
}



// Função para posicionar a mina aleatoriamente no tabuleiro do adversário
function posicionarMina(matriz) {
  let posicionado = false;

  while (!posicionado) {
    const linha = Math.floor(Math.random() * matriz.length);
    const coluna = Math.floor(Math.random() * matriz[linha].length);

    // Verifica se a célula está vazia e não foi clicada
    if (matriz[linha][coluna] === "~") {
      matriz[linha][coluna] = "M"; // Coloca a mina na célula, mas sem visibilidade
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
  // Verifica se o jogador está perdendo turnos
  if (turnosPerdidosJogador1 > 0 && turno === 1) {
    turnosPerdidosJogador1--;
    mensagem.innerText = `Jogador 1 está perdendo um turno. ${turnosPerdidosJogador1} turnos restantes.`;
    return;
  }
  
  if (turnosPerdidosJogador2 > 0 && turno === 2) {
    turnosPerdidosJogador2--;
    mensagem.innerText = `Jogador 2 está perdendo um turno. ${turnosPerdidosJogador2} turnos restantes.`;
    return;
  }
  
  // Alterna o turno
  turno = turno === 1 ? 2 : 1;
  mensagem.innerText = `Turno do Jogador ${turno}`;
});

// Inicialização do Jogo
inicializarTabuleiro(tabuleiro1, tabuleiroJogador2, 1);
inicializarTabuleiro(tabuleiro2, tabuleiroJogador1, 2);
posicionarNavios(tabuleiroJogador1);
posicionarNavios(tabuleiroJogador2);
criarMenuCompras(); // Cria o menu de compras
mensagem.innerText = `Turno do Jogador ${turno}`;