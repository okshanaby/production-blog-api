import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";

const apiV1Router = Router();

// Root route
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

// Auth routes
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/users", userRouter);

export default apiV1Router;
