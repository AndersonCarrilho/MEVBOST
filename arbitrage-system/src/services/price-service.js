const { binance } = require('../api');
const logger = require('../utils/logger');
const NodeCache = require('node-cache');

// Cache para 10 segundos
const priceCache = new NodeCache({ stdTTL: 10 });

class PriceService {
  /**
   * Obtém preços atualizados de múltiplas exchanges para o mesmo par
   * @param {string} pair - Par de trading (ex: 'ETHUSDT')
   * @returns {Promise<Array>} - Array com preços em diferentes exchanges
   */
  async getPriceAcrossExchanges(pair) {
    // Verificar cache
    const cacheKey = `prices_${pair}`;
    const cachedPrices = priceCache.get(cacheKey);
    
    if (cachedPrices) {
      return cachedPrices;
    }

    try {
      // Obter preços de diferentes exchanges
      const [binancePrice] = await Promise.all([
        binance.getPrice(pair)
        // Adicione outras exchanges aqui
      ]);
      
      // Simular outras exchanges com variação
      const simulatedExchanges = this.simulateOtherExchanges(binancePrice, 3);
      
      // Combinar preços reais e simulados
      const prices = [binancePrice, ...simulatedExchanges];
      
      // Armazenar no cache
      priceCache.set(cacheKey, prices);
      
      return prices;
    } catch (error) {
      logger.error(`Erro ao obter preços para ${pair}: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Simula preços em outras exchanges (para fins de demonstração)
   * @param {number} basePrice - Preço base
   * @param {number} count - Número de exchanges a simular
   * @returns {number[]} - Preços simulados
   */
  simulateOtherExchanges(basePrice, count) {
    const prices = [];
    for (let i = 0; i < count; i++) {
      // Variação de -1% a +1% para simulação
      const variation = (Math.random() * 2 - 1) / 100;
      prices.push(basePrice * (1 + variation));
    }
    return prices;
  }
}

module.exports = new PriceService();
