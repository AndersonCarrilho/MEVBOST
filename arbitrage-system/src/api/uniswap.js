const { ethers } = require('ethers');
const config = require('../utils/config');
const logger = require('../utils/logger');

// ABI mínimo para consulta de preços no Uniswap
const UNISWAP_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)'
];

class UniswapAPI {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.exchanges.uniswap.providerUrl);
    this.router = new ethers.Contract(
      config.exchanges.uniswap.routerAddress,
      UNISWAP_ROUTER_ABI,
      this.provider
    );
    
    // Mapeamento de símbolos para endereços
    this.tokenAddresses = {
      'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      // Adicione mais tokens conforme necessário
    };
  }

  /**
   * Obtém o preço de um token em relação a outro
   * @param {string} tokenA - Símbolo do token A
   * @param {string} tokenB - Símbolo do token B
   * @param {number} amountIn - Quantidade de entrada (em unidades menores)
   * @returns {Promise<number>} - Preço de B em termos de A
   */
  async getPrice(tokenA, tokenB, amountIn = ethers.utils.parseEther('1')) {
    try {
      const addressA = this.tokenAddresses[tokenA];
      const addressB = this.tokenAddresses[tokenB];
      
      if (!addressA || !addressB) {
        throw new Error(`Endereço não encontrado para ${!addressA ? tokenA : tokenB}`);
      }
      
      const path = [addressA, addressB];
      const amounts = await this.router.getAmountsOut(amountIn, path);
      
      // Normalizar com base nos decimais (simplificado)
      return ethers.utils.formatEther(amounts[1]);
    } catch (error) {
      logger.error(`Erro ao obter preço Uniswap ${tokenA}/${tokenB}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UniswapAPI();
