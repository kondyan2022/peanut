const express = require("express");
const router = express.Router();
const { validateQuery } = require("../middleware");
const schemas = require("../schemas");
const ctrl = require("../controllers");

/**
 * @swagger
 * /estimate:
 *   get:
 *     summary: Returns the exchange with the best rate
 *     parameters:
 *     - in: query
 *       name: inputAmount
 *       required: true
 *       schema:
 *         type: number
 *         example: 0.5
 *       description: Input amount
 *     - in: query
 *       name: inputCurrency
 *       required: true
 *       schema:
 *         type: string
 *         example: BTC
 *       description: Input currency
 *     - in: query
 *       name: outputCurrency
 *       required: true
 *       schema:
 *         type: string
 *         example: USDT
 *       description: Output currency
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exchangeName:
 *                   type: string
 *                   example: binance
 *                 outputAmount:
 *                   type: number
 *                   example: 33000
 *
 */

router.get("/estimate", validateQuery(schemas.estimate), ctrl.estimate);

/**
 * @swagger
 * /getRates:
 *   get:
 *     summary: Returns the rate on all exchanges for a pair of coins
 *     parameters:
 *     - in: query
 *       name: baseCurrency
 *       required: true
 *       schema:
 *         type: string
 *         example: BTC
 *       description: Base currency
 *     - in: query
 *       name: quoteCurrency
 *       required: true
 *       schema:
 *         type: string
 *         example: USDT
 *       description: Quote currency
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   exchangeName:
 *                     type: string
 *                   outputAmount:
 *                     type: number
 *               example:
 *               - exchangeName: binance
 *                 outputAmount: 66000.25
 *               - exchangeName: kucoin
 *                 outputAmount: 66001.67
 * */

router.get("/getRates", validateQuery(schemas.getRates), ctrl.getRates);

module.exports = router;
