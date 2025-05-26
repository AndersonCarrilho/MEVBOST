const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Carregar configuração
const configPath = path.join(__dirname, '../../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Substituir valores sensíveis com variáveis de ambiente
if (process.env.BINANCE_API_KEY) {
  config.exchanges.binance.apiKey = process.env.BINANCE_API_KEY;
}
if (process.env.BINANCE_API_SECRET) {
  config.exchanges.binance.apiSecret = process.env.BINANCE_API_SECRET;
}
if (process.env.INFURA_KEY) {
  config.exchanges.uniswap.providerUrl = 
    config.exchanges.uniswap.providerUrl.replace('YOUR_INFURA_KEY', process.env.INFURA_KEY);
}

module.exports = config;
