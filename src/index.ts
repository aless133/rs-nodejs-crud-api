import * as dotenv from "dotenv";
dotenv.config();

import http from "node:http";
import fsPromises from "node:fs/promises";
// import { __dirname } from "./common";
// import db from "./db";

// console.log(__dirname);
// console.log(process.env.PORT);
const server = createServer(parseInt(process.env.PORT as string));

function createServer(port: number) {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      res.statusCode = 200;
      res.end("ok");
    } catch (err) {
      res.statusCode = 500;
      if (err instanceof Error) {
        res.end(err.message);
      } else {
        res.end(err as string);
      }
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log("listening", port);
  });
  return server;
}
