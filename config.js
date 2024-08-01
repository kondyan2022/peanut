module.exports = {
  scriptPath: "/exchanges",
  coinPairs: [
    ["BTC", "USDT"],
    ["ETH", "USDT"],
    ["ETH", "BTC"],
  ],
  exchanges: [
    { name: "Binance", script: "binance.js" },
    { name: "KuCoin", script: "kucoin.js" },
  ],
};
