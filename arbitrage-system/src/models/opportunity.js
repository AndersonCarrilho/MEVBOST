class ArbitrageOpportunity {
  constructor(tokenPair, exchanges, prices, profit, timestamp = Date.now()) {
    this.tokenPair = tokenPair;
    this.buyExchange = exchanges[0];
    this.sellExchange = exchanges[1];
    this.buyPrice = prices[0];
    this.sellPrice = prices[1];
    this.profitPercentage = profit;
    this.timestamp = timestamp;
  }

  isViable(threshold = 10.0) {
    return this.profitPercentage >= threshold;
  }

  toString() {
    return `[${this.tokenPair}] Comprar em ${this.buyExchange} por ${this.buyPrice}, ` +
           `vender em ${this.sellExchange} por ${this.sellPrice}, ` + 
           `lucro: ${this.profitPercentage.toFixed(2)}%`;
  }
}

module.exports = ArbitrageOpportunity;
