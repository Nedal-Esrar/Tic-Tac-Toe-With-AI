class Player {
  #sign;

  constructor(sign) {
    this.#sign = sign;
  }

  getSign() {
    return this.#sign;
  }

  setSign(sign) {
    this.#sign = sign;
  }
}

class XOBoard {
  #board;

  constructor() {
    this.#board = Array(9).fill(undefined);
  }

  getSignAt(index) {
    return this.#board[index];
  }

  setSignAt(index, sign) {
    this.#board[index] = sign;
  }

  getEmptyCellsIndices() {
    return this.#board.reduce((acc, val, index) => {
      if (val === undefined) {
        acc.push(index);
      }

      return acc;
    }, []);
  }

  clear() {
    for (let i = 0; i < 9; ++i) {
      this.#board[i] = undefined;
    }
  }
}

const humanPlayer = new Player('X');
const AIPlayer = new Player('O');

const board = new XOBoard();

let AIAccuracy = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chooseCell = () => {
  const rnd = Math.floor(100 * Math.random());

  let choice;

  const emptyCellsIndices = board.getEmptyCellsIndices();

  if (rnd < AIAccuracy) {
    let bestScore = -Infinity;

    emptyCellsIndices.forEach((index) => {
      board.setSignAt(index, AIPlayer.getSign());

      let minimaxResult = minimax(true);

      if (minimaxResult > bestScore) {
        bestScore = minimaxResult;
        choice = index;
      }

      board.setSignAt(index, undefined);
    });
  } else {
    let randomIndex = Math.floor(emptyCellsIndices.length * Math.random());

    choice = emptyCellsIndices[randomIndex];
  }

  return choice;
}

const minimax = (isHuman) => {
  if (checkForWin()) {
    return isHuman ? 1 : -1;
  }

  if (checkForDraw()) {
    return 0;
  }

  const emptyCellsIndices = board.getEmptyCellsIndices();

  let bestScore;

  if (isHuman) {
    bestScore = Infinity;

    emptyCellsIndices.forEach((index) => {
      board.setSignAt(index, humanPlayer.getSign());

      bestScore = Math.min(bestScore, minimax(false));

      board.setSignAt(index, undefined);
    });
  } else {
    bestScore = -Infinity;

    emptyCellsIndices.forEach((index) => {
      board.setSignAt(index, AIPlayer.getSign());

      bestScore = Math.max(bestScore, minimax(true));

      board.setSignAt(index, undefined);
    });
  }

  return bestScore;
}

const checkRowsForWin = () => {
  for (let i = 0; i < 3; ++i) {
    let row = [];

    for (let j = 3 * i; j < 3 * i + 3; ++j) {
      row.push(board.getSignAt(j));
    }

    if (row.every(cell => cell === 'X') || row.every(cell => cell === 'O')) {
      return true;
    }
  }

  return false;
}

const checkColumnsForWin = () => {
  for (let i = 0; i < 3; ++i) {
    let column = [];

    for (let j = 0; j < 3; ++j) {
      column.push(board.getSignAt(i + 3 * j));
    }

    if (column.every(cell => cell === 'X') || column.every(cell => cell === 'O')) {
      return true;
    }
  }

  return false;
}

const checkMainDiagonalForWin = () => {
  let mainDiagonal = [];

  for (let i = 0; i < 3; ++i) {
    mainDiagonal.push(board.getSignAt(i * 4));
  }

  return mainDiagonal.every(cell => cell === 'X') || 
         mainDiagonal.every(cell => cell === 'O');
}

const checkAuxiliaryDiagonalForWin = () => {
  let auxiliaryDiagonal = [];

  for (let i = 0; i < 3; ++i) {
    auxiliaryDiagonal.push(board.getSignAt(2 * i + 2));
  }

  return auxiliaryDiagonal.every(cell => cell === 'X') || 
         auxiliaryDiagonal.every(cell => cell === 'O');
}

const checkForWin = () => {
  return checkRowsForWin() || 
         checkColumnsForWin() || 
         checkMainDiagonalForWin() ||
         checkAuxiliaryDiagonalForWin();
}

const checkForDraw = () => board.getEmptyCellsIndices().length === 0;

const playHuman = (index) => {
  const cellSign = board.getSignAt(index);

  if (cellSign !== undefined) {
    return true;
  }

  board.setSignAt(index, humanPlayer.getSign());

  boardCells[index].textContent = board.getSignAt(index);

  if (checkForWin()) {
    declareResult(humanPlayer.getSign());

    return true;
  } else if (checkForDraw()) {
    declareResult("Draw");

    return true;
  }
  
  return false;
}

const getBoardCells = () => {
  let ret = []

  for (let i = 0; i < 9; ++i) {
    ret.push(board.getSignAt(i));
  }

  return ret;
}

const boardCells = document.querySelectorAll('.board-button');

const xChoiceButton = document.getElementById('x');
const oChoiceButton = document.getElementById('o');

const activateCells = () => {
  boardCells.forEach(cell => cell.removeAttribute('disabled'));
}

const activateChoiceButtons = () => {
  xChoiceButton.removeAttribute('disabled');
  oChoiceButton.removeAttribute('disabled');
}

const deactivateCells = () => {
  boardCells.forEach(cell => cell.setAttribute('disabled', ''));
}

const deactivateChoiceButtons = () => {
  xChoiceButton.setAttribute('disabled', '');
  oChoiceButton.setAttribute('disabled', '');
}

const playAI = () => {
  const choice = chooseCell();

  board.setSignAt(choice, AIPlayer.getSign());

  boardCells[choice].textContent = board.getSignAt(choice);

  if (checkForWin()) {
    declareResult(AIPlayer.getSign());

    return true;
  } else if (checkForDraw()) {
    declareResult("Draw");

    return true;
  }

  return false;
}

boardCells.forEach((cell, index) => {
  cell.addEventListener('click', async () => {
    let gameEnds = playHuman(index);

    console.log(getBoardCells());

    if (gameEnds) {
      return;
    }

    deactivateCells();

    deactivateChoiceButtons();

    await sleep(500);

    gameEnds = playAI();

    console.log(getBoardCells());

    if (gameEnds) {
      return;
    }

    activateCells();

    activateChoiceButtons();
  });
});

const gameContainer = document.getElementById('game-container');

const resultTexts = document.querySelectorAll('#result-pop-up div');

const body = document.querySelector('body');

const restartGame = () => {
  gameContainer.classList.add('unblur');

  gameContainer.classList.remove('blur');

  reset();

  activateCells();

  activateChoiceButtons();

  body.removeEventListener('click', restartGame);
}

const declareResult = async (result) => {
  gameContainer.classList.remove('unblur');
  gameContainer.classList.add('blur');

  if (result == 'Draw') {
    resultTexts[3].classList.add('active');
  } else {
    resultTexts[0].classList.add('active');

    if (result === 'X') {
      resultTexts[1].classList.add('active');
    } else {
      resultTexts[2].classList.add('active');
    }
  }

  deactivateCells();

  deactivateChoiceButtons();

  await sleep(500);

  body.addEventListener('click', restartGame)
}

const changeHumanSign = (sign) => {
  xChoiceButton.classList.remove('selected', 'not-selected');
  oChoiceButton.classList.remove('selected', 'not-selected');

  if (sign == 'X') {
    humanPlayer.setSign('X');
    AIPlayer.setSign('O');

    xChoiceButton.classList.add('selected');
    oChoiceButton.classList.add('not-selected');
  } else {
    humanPlayer.setSign('O');
    AIPlayer.setSign('X');

    oChoiceButton.classList.add('selected');
    xChoiceButton.classList.add('not-selected');
  }
}

const clearCells = () => {
  boardCells.forEach(cell => cell.textContent = '');
}

const reset = () => {
  board.clear();

  clearCells();

  if (humanPlayer.getSign() == 'O') {
    playAI();
  }

  resultTexts.forEach(text => text.classList.remove('active'));
}

xChoiceButton.addEventListener('click', () => {
  changeHumanSign('X');

  reset();
});

oChoiceButton.addEventListener('click', () => {
  changeHumanSign('O');

  reset();
});

const AIAccuracyDropList = document.getElementById('levels-drop-list');

const changeAIAccuracy = (value) => {
  switch (value) {
    case 'easy':
      AIAccuracy = 0;
      break;
    case 'medium':
      AIAccuracy = 50;
      break;
    case 'hard':
      AIAccuracy = 90;
      break;
    case 'unbeatable':
      AIAccuracy = 100;
  }
}

const AILevelSelection = document.getElementById('ai-level-selection');

AILevelSelection.addEventListener('change', () => {
  changeAIAccuracy(AIAccuracyDropList.value);

  reset();
});

changeHumanSign('X');

const restartButton = document.getElementById('restart-button');

restartButton.addEventListener('click', reset);