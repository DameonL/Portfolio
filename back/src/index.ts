import express from "express";

const port = 7463;
const app = express();
app.use("/", express.static("wwwroot"));

const server = app.listen(port, () => {
  console.log(`Server started on port ${(server.address() as any).port}`)
});