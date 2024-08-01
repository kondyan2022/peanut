const { getRates } = require("../schemas");

module.exports = {
  table: {},
  update(coin1, coin2, name, rate) {
    this.table = {
      ...this.table,
      [coin1]: {
        ...this.table[coin1],
        [coin2]: {
          ...this.table[coin1]?.[coin2],
          [name]: rate,
        },
      },
      [coin2]: {
        ...this.table[coin2],
        [coin1]: {
          ...this.table[coin2]?.[coin1],
          [name]: 1 / rate,
        },
      },
    };
  },
  estimate(inputAmount, inputCurrency, outputCurrency) {
    return new Promise((resolve, reject) => {
      const ExchangeRates = this.table[inputCurrency]?.[outputCurrency];
      if (!ExchangeRates) {
        reject("No exchanges trade data");
      }
      const bestExchange = Object.keys(ExchangeRates).reduce((acc, a) =>
        ExchangeRates[acc] > ExchangeRates[a] ? acc : a
      );
      resolve({
        exchangeName: bestExchange,
        outputAmount: ExchangeRates[bestExchange] * inputAmount,
      });
    });
  },
  getRates(baseCurrency, quoteCurrency) {
    return new Promise((resolve, reject) => {
      const ExchangeRates = this.table[baseCurrency]?.[quoteCurrency];
      if (!ExchangeRates) {
        reject("No exchanges trade data");
      }

      resolve(
        Object.keys(ExchangeRates).reduce(
          (acc, exchangeName) => [
            ...acc,
            { exchangeName, rate: ExchangeRates[exchangeName] },
          ],
          []
        )
      );
    });
  },
};
