const Joi = require("joi");
const config = require("../config");

const coinList = new Set(config.coinPairs.flat());

const estimate = Joi.object({
  inputAmount: Joi.number().greater(0).required(),
  inputCurrency: Joi.string()
    .valid(...coinList)
    .required(),
  outputCurrency: Joi.string()
    .valid(...coinList)
    .required(),
}).custom((obj, helper) => {
  const { inputCurrency, outputCurrency } = obj;
  if (outputCurrency === inputCurrency) {
    return helper.message(`"outputCurrency" must not be equal "inputCurrency"`);
  }
  return obj;
});

const getRates = Joi.object({
  baseCurrency: Joi.string()
    .valid(...coinList)
    .required(),
  quoteCurrency: Joi.string()
    .valid(...coinList)
    .required(),
}).custom((obj, helper) => {
  const { baseCurrency, quoteCurrency } = obj;
  if (baseCurrency === quoteCurrency) {
    return helper.message(`"quoteCurrency" must not be equal "baseCurrency"`);
  }
  return obj;
});

module.exports = { estimate, getRates };
