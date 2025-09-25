import config from "@/config";
import express from "express";
const app = express();

app.get("/", (_, res) => {
  res.json({ message: "Hello World" });
});

app.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});
