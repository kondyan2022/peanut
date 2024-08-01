const WebSocket = require("ws");
const { parentPort, workerData } = require("worker_threads");

const subscribeList = workerData
  .map((pair) => `/${pair[0]}${pair[1]}@trade`.toLowerCase())
  .join("");

const searchList = {};
workerData.forEach((pair) => {
  searchList[`${pair[0]}${pair[1]}`] = { coin1: pair[0], coin2: pair[1] };
});

const socket = new WebSocket(
  `wss://stream.binance.com:9443/ws${subscribeList}`
);

socket.on("open", (socket) => {
  console.log("Binance connect!");
});

socket.on("message", (data) => {
  const { s: ticket, p: rate } = JSON.parse(data);
  parentPort.postMessage({ ...searchList[ticket], rate: parseFloat(rate) });
});

socket.on("ping", (data) => {
  socket.pong(data);
});

socket.on("error", (socket) => {
  console.log("Binance error! ");
});

socket.on("close", (socket) => {
  console.log("Binance disconnect! ");
});
