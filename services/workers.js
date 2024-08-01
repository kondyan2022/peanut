const { Worker } = require("worker_threads");
const path = require("path");
const config = require("../config");
const dashboard = require("./dashboard");

const scriptFolderPath = path.join(__dirname, config.scriptPath);

let workers = [];

function createWorker(scriptPath, workerData, exchangeName) {
  const worker = new Worker(scriptPath, { workerData });

  worker.on("message", (data) => {
    const { coin1, coin2, rate } = data;
    dashboard.update(coin1, coin2, exchangeName.toLowerCase(), rate);
  });

  worker.on("exit", (code) => {
    console.log(`Worker shutdown: ${exchangeName}, code:${code}`);
    if (!code) {
      workers = workers.filter((elem) => elem !== worker);
      console.log(`Restart ${exchangeName} ...`);
      workers.push(createWorker(scriptPath, workerData, exchangeName));
    }
  });
  return worker;
}

function startWorkers() {
  for (const [index, exchange] of Object.entries(config.exchanges)) {
    const scriptPath = path.join(scriptFolderPath, exchange.script);
    const worker = createWorker(scriptPath, config.coinPairs, exchange.name);
    workers.push(worker);
  }
}

const terminateWorkers = async () => {
  console.log(dashboard.table);
  for (const worker of workers) {
    await worker.terminate();
  }
};

module.exports = { dashboard, terminateWorkers, startWorkers };
