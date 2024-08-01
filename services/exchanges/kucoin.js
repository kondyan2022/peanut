const WebSocket = require("ws");
const { parentPort, workerData } = require("worker_threads");

const subscribeList = workerData
  .map((pair) => `${pair[0]}-${pair[1]}`)
  .join(",");

const searchList = {};
workerData.forEach((pair) => {
  searchList[`${pair[0]}-${pair[1]}`] = { coin1: pair[0], coin2: pair[1] };
});

const getToken = async () => {
  const response = await fetch("https://api.kucoin.com/api/v1/bullet-public", {
    method: "POST",
  });
  const result = await response.json();
  const { data, code } = result;
  if (code !== "200000") {
    throw new Error("Request to receive token rejected");
  }
  const { token, instanceServers } = data;
  const { endpoint, pingInterval } = instanceServers[0];

  return { endpoint, pingInterval, token };
};

getToken()
  .then(({ endpoint, pingInterval, token }) => {
    const socket = new WebSocket(`${endpoint}?token=${token}`);
    socket.on("open", () => {
      console.log("Kucoin connect!");
    });

    socket.on("message", (data) => {
      const socketData = JSON.parse(data);
      if (socketData.type === "welcome") {
        console.log("Kucoin: received Welcome");
        socket.send(
          JSON.stringify({
            id: socketData.id,
            type: "subscribe",
            topic: `/market/ticker:${subscribeList}`,
            privateChannel: false,
            response: true,
          })
        );
        setTimeout(() => {
          socket.ping(JSON.stringify({ id: socketData.id, type: "ping" }));
        }, pingInterval);
        return;
      }
      if (socketData.type === "ask") {
        setTimeout(() => {
          socket.ping(JSON.stringify({ id: socketData.id, type: "ping" }));
        }, pingInterval);
        return;
      }
      if (socketData.type === "message") {
        const { price } = socketData.data;
        const ticket = socketData.topic.replace("/market/ticker:", "");
        parentPort.postMessage({
          ...searchList[ticket],
          rate: parseFloat(price),
        });
      }
    });

    socket.on("pong", (data) => {
      const socketData = JSON.parse(data);
      setTimeout(() => {
        socket.ping(JSON.stringify({ id: socketData.id, type: "ping" }));
      }, pingInterval);
    });

    socket.on("error", (error) => {
      console.log("KuCoin error! ", error);
    });

    socket.on("close", () => {
      console.log("KuCoin disconnect! ");
    });
    return socket;
  })
  .catch((error) => console.log(error));
