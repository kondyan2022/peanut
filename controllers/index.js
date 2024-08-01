const { dashboard } = require("../services/workers");
const { ctrlWrapper } = require("../utils");

const estimate = async (req, res, next) => {
  const { inputAmount, inputCurrency, outputCurrency } = req.query;

  return res.json(
    await dashboard.estimate(inputAmount, inputCurrency, outputCurrency)
  );
};

const getRates = async (req, res, next) => {
  const { baseCurrency, quoteCurrency } = req.query;

  return res.json(await dashboard.getRates(baseCurrency, quoteCurrency));
};

module.exports = {
  estimate: ctrlWrapper(estimate),
  getRates: ctrlWrapper(getRates),
};
