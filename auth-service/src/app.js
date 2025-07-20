import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import logger from "./utils/logger.js";
import { metricsMiddleware, metricsEndpoint } from "./utils/metrics.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Requisição recebida: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  });
  next();
});

app.use(metricsMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/metrics", metricsEndpoint);

routes(app);

export default app;
