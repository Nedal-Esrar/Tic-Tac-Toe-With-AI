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

export default Player;