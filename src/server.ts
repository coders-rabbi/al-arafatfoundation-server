import http from "http";
import { app } from "./app";
import config from "./app/config";
import { initSocket } from "./app/socket";

const server = http.createServer(app);

initSocket(server);

const PORT = config.port || 5000;
server.listen(PORT, () => {
  console.log(`Arafat Foundation app listening on port ${PORT}`);
});

process.on("unhandledRejection", () => {
  console.log("Unhandled rejection detected, shutting down...");
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("Uncaught exception detected, shutting down...");
  process.exit(1);
});

export default app;
