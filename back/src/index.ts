import express from "express";

const app = express();
app.use("/", express.static("wwwroot"));

const server = app.listen(() => {
  console.log(`Server started on port ${(server.address() as any).port}`)
});