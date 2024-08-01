const express = require("express");
const logger = require("morgan");

const { terminateWorkers, startWorkers } = require("./services/workers");
const { specs, swaggerUi } = require("./swagger");

const mainRouter = require("./routes");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", mainRouter);

// app.get("/estimate", validateQuery(schemas.estimate), ctrl.estimate);
// app.get("/getRates", validateQuery(schemas.getRates), ctrl.getRates);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const server = app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
  startWorkers();
});

const terminate = () => {
  server.close(async () => {
    console.log("Server shutdown");
    await terminateWorkers();
    process.exit();
  });
};
process.on("SIGINT", terminate);
process.on("SIGTERM", terminate);
