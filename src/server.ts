import http from "node:http";
import * as api from "./api";
import { IApi } from "./types";

export const createServer = (port: number) => {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    //skip favicon
    if (req.method == "GET" && req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end();
      return;
    }

    console.log("request", ":" + port, req.method, req.url);
    let ret: IApi = { code: 0, data: "" };
    try {
      if (req.url && req.url.startsWith("/api/")) {
        ret = api.handleRequest(req);
      } else {
        ret = { code: 404, data: api.messages.NOT_FOUND };
      }
    } catch (err) {
      //console.error(err);
      ret.code = 500;
      if (err instanceof Error) {
        ret.data = err.message;
      } else {
        ret.data = err as string;
      }
    }
    res.statusCode = ret.code;
    console.log("result", ":" + port, ret.code, ret.data);
    if (typeof ret.data === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(ret.data, null, 3));
    } else {
      res.end(ret.data);
    }
  });
  server.listen(port, () => {
    console.log("listening :" + port);
  });
  return server;
};
