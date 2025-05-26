class Token {
  constructor(symbol, name, decimal) {
    this.symbol = symbol;
    this.name = name || symbol;
    this.decimal = decimal || 18;
  }

  formatPair(otherToken) {
    return `${this.symbol}${otherToken.symbol}`;
  }
}

module.exports = Token;
