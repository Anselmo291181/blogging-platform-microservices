import client from "prom-client";

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Número total de requisições HTTP",
  labelNames: ["method", "route", "status"],
});

const recordHttpRequest = (method, route, status) => {
  httpRequestCounter.labels(method, route, status).inc();
};

const metricsMiddleware = (req, res, next) => {
  res.on("finish", () => {
    const route = req.route?.path || req.originalUrl;
    recordHttpRequest(req.method, route, res.statusCode);
  });
  next();
};

const metricsEndpoint = async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
};

export { metricsMiddleware, metricsEndpoint };
