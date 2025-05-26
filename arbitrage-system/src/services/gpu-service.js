const axios = require('axios');
const config = require('../utils/config');
const logger = require('../utils/logger');

class GPUService {
  constructor() {
    this.url = config.gpuService.url;
    this.timeout = config.gpuService.timeout;
  }

  /**
   * Envia preços para o serviço GPU e recebe oportunidades
   * @param {number[]} precos - Array de preços
   * @param {number[]} taxas - Array de taxas (opcional)
   * @returns {Promise<Object>} - Resultado da análise
   */
  async analisarPrecos(precos, taxas = null) {
    try {
      const payload = {
        precos: precos
      };

      if (taxas) {
        payload.taxas = taxas;
      }

      const response = await axios.post(this.url, payload, {
        timeout: this.timeout
      });

      logger.debug(`GPU: Análise concluída em ${response.data.tempo_processamento_ms.toFixed(2)}ms`);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao comunicar com serviço GPU: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica se o serviço GPU está respondendo
   * @returns {Promise<boolean>} - True se o serviço estiver ativo
   */
  async healthCheck() {
    try {
      const response = await axios.get(
        `${this.url.substring(0, this.url.lastIndexOf('/'))}/health`, 
        { timeout: 5000 }
      );
      return response.data.status === 'ok';
    } catch (error) {
      logger.error(`Erro no health check do serviço GPU: ${error.message}`);
      return false;
    }
  }
}

module.exports = new GPUService();
