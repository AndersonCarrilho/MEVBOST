const config = require('./utils/config');
const logger = require('./utils/logger');
const priceService = require('./services/price-service');
const gpuService = require('./services/gpu-service');
const ArbitrageOpportunity = require('./models/opportunity');

async function monitor() {
  logger.info('Iniciando monitoramento de arbitragem...');
  const { pairs, monitoring } = config;

  while (true) {
    try {
      for (const pair of pairs) {
        const prices = await priceService.getPriceAcrossExchanges(pair.join(''));
        const analysisResult = await gpuService.analisarPrecos(prices);

        if (analysisResult.potencial_lucro >= monitoring.minProfitThreshold) {
          const opportunity = new ArbitrageOpportunity(
            pair,
            ['Exchange1', 'Exchange2'], // Exemplo, ajustar conforme exchanges reais
            [analysisResult.preco_compra, analysisResult.preco_venda],
            analysisResult.potencial_lucro
          );

          if (opportunity.isViable(monitoring.minProfitThreshold)) {
            logger.info(`Oportunidade encontrada: ${opportunity.toString()}`);
            // Chamar função de execução de arbitragem
            // await executeArbitrage(opportunity);
          }
        } else {
          logger.info(`Nenhuma oportunidade viável para ${pair.join('/')}`);
        }
      }
    } catch (error) {
      logger.error(`Erro no monitoramento: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, monitoring.interval));
  }
}

monitor();
