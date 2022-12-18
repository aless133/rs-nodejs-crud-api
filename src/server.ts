import http from "node:http";
import { IApiReturn, TRequestHandler } from "./types";

export const createServer = (port: number, action: TRequestHandler) => {
  const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    //skip favicon
    if (req.method == "GET" && req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end();
      return;
    }

    console.log("request", ":" + port, req.method, req.url);
    let ret: IApiReturn = { code: 0, data: "" };
    try {
      ret = await action(req);
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
    // if (ret.headers) {
    //   Object.keys(ret.headers).forEach((k) => {
    //     if (ret.headers) {
    //       res.setHeader(k, ret.headers[k]);
    //     }
    //   });
    // }
    // if (typeof ret.data === "object") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(ret.data));
    // } else {
    // res.end(ret.data);
    // }
  });

  server.listen(port, () => {
    console.log("listening :" + port);
  });
  return server;
};
