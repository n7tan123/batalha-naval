// Funções para salvar e carregar o jogo usando localStorage

/**
 * Salva o estado atual do jogo no localStorage.
 * Inclui os tabuleiros, inventários, dinheiro e turnos dos jogadores.
 */
function saveGame() {
    const gameState = {
        player1Board: getBoardState('player1'),
        player2Board: getBoardState('player2'),
        player1Inventory: getInventoryState('player1'),
        player2Inventory: getInventoryState('player2'),
        player1Money: player1Money,
        player2Money: player2Money,
        currentPlayer: currentPlayer,
    };

    localStorage.setItem('batalhaNavalSave', JSON.stringify(gameState));
    alert('Jogo salvo com sucesso!');
}

/**
 * Carrega o estado do jogo a partir do localStorage.
 */
function loadGame() {
    const savedGame = localStorage.getItem('batalhaNavalSave');

    if (!savedGame) {
        alert('Nenhum jogo salvo encontrado!');
        return;
    }

    const gameState = JSON.parse(savedGame);

    setBoardState('player1', gameState.player1Board);
    setBoardState('player2', gameState.player2Board);
    setInventoryState('player1', gameState.player1Inventory);
    setInventoryState('player2', gameState.player2Inventory);
    player1Money = gameState.player1Money;
    player2Money = gameState.player2Money;
    currentPlayer = gameState.currentPlayer;

    alert('Jogo carregado com sucesso!');
    updateUI();
}

/**
 * Retorna o estado do tabuleiro de um jogador.
 * @param {string} player - O jogador ("player1" ou "player2").
 */
function getBoardState(player) {
    const board = [];
    const boardElement = document.querySelector(`#${player}Board`);
    boardElement.querySelectorAll('tr').forEach(row => {
        const rowState = [];
        row.querySelectorAll('td').forEach(cell => {
            rowState.push(cell.className);
        });
        board.push(rowState);
    });
    return board;
}

/**
 * Define o estado do tabuleiro de um jogador.
 * @param {string} player - O jogador ("player1" ou "player2").
 * @param {Array} boardState - O estado do tabuleiro para configurar.
 */
function setBoardState(player, boardState) {
    const boardElement = document.querySelector(`#${player}Board`);
    boardElement.querySelectorAll('tr').forEach((row, rowIndex) => {
        row.querySelectorAll('td').forEach((cell, colIndex) => {
            cell.className = boardState[rowIndex][colIndex];
        });
    });
}

/**
 * Retorna o estado do inventário de um jogador.
 * @param {string} player - O jogador ("player1" ou "player2").
 */
function getInventoryState(player) {
    const inventoryElement = document.querySelector(`#${player}Inventory`);
    return Array.from(inventoryElement.children).map(item => item.dataset.type);
}

/**
 * Define o estado do inventário de um jogador.
 * @param {string} player - O jogador ("player1" ou "player2").
 * @param {Array} inventoryState - O estado do inventário para configurar.
 */
function setInventoryState(player, inventoryState) {
    const inventoryElement = document.querySelector(`#${player}Inventory`);
    inventoryElement.innerHTML = '';
    inventoryState.forEach(itemType => {
        const itemElement = document.createElement('div');
        itemElement.dataset.type = itemType;
        itemElement.textContent = itemType;
        inventoryElement.appendChild(itemElement);
    });
}

/**
 * Atualiza a interface do usuário para refletir o estado atual do jogo.
 */
function updateUI() {
    // Atualizar dinheiro, turnos ou outras informações necessárias na interface do usuário
    document.querySelector('#player1Money').textContent = player1Money;
    document.querySelector('#player2Money').textContent = player2Money;
    document.querySelector('#currentPlayer').textContent = currentPlayer;
}

// Event listeners para os botões de salvar e carregar
const saveButton = document.querySelector('#saveGame');
const loadButton = document.querySelector('#loadGame');

saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);