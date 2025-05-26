const axios = require('axios');
const crypto = require('crypto');
const config = require('../utils/config');
const logger = require('../utils/logger');

class BinanceAPI {
  constructor() {
    this.baseUrl = config.exchanges.binance.baseUrl;
    this.apiKey = config.exchanges.binance.apiKey;
    this.apiSecret = config.exchanges.binance.apiSecret;
  }

  /**
   * Obtém o preço atual de um par
   * @param {string} symbol - Par de trading (ex: ETHUSDT)
   * @returns {Promise<number>} - Preço atual
   */
  async getPrice(symbol) {
    try {
      const url = `${this.baseUrl}/api/v3/ticker/price`;
      const response = await axios.get(url, {
        params: { symbol }
      });
      return parseFloat(response.data.price);
    } catch (error) {
      logger.error(`Erro ao obter preço Binance para ${symbol}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtém preços para múltiplos pares
   * @param {string[]} symbols - Lista de pares
   * @returns {Promise<Object>} - Mapa de símbolo para preço
   */
  async getPrices(symbols) {
    try {
      const url = `${this.baseUrl}/api/v3/ticker/price`;
      const response = await axios.get(url);
      const priceMap = {};
      
      // Filtrar apenas os símbolos solicitados
      response.data.forEach(item => {
        if (symbols.includes(item.symbol)) {
          priceMap[item.symbol] = parseFloat(item.price);
        }
      });
      
      return priceMap;
    } catch (error) {
      logger.error(`Erro ao obter preços Binance: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new BinanceAPI();
