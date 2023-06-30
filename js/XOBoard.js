class XOBoard {
  #board;

  constructor() {
    this.#board = Array(9);
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
    this.#board.map(cell => undefined);
  }
}

export default XOBoard;