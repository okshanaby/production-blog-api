import { Router } from "express";

const apiV1Router = Router();

apiV1Router.get("/", (_, res) => {
  res.json({
    message: "API is live",
    success: true,
    status: "OK",
    version: "1.0.0",
    docs: "https://github.com/OkshanAby/production-blog-api",
    timestamp: new Date().toISOString(),
  });
});

export default apiV1Router;
