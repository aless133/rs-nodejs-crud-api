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

    console.log("Request", ":" + port, req.method, req.url);
    let ret: IApiReturn = { code: 0, data: "" };
    try {
      ret = await action(req);
    } catch (err) {
      ret.code = 500;
      if (err instanceof Error) {
        ret.data = err.message;
      } else {
        ret.data = err as string;
      }
    }
    res.statusCode = ret.code;
    console.log("Result", ":" + port, ret.code, ret.data);
    if (typeof ret.data === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(ret.data));
    } else {
      res.end(ret.data);
    }
  });

  server.listen(port, () => {
    console.log("Server listening :" + port);
  });
  return server;
};

export const createProxy = (port: number, getPort: () => number) => {
  const proxyServer = http.createServer((req, res) => {
    console.log("Request to proxy", ":" + port, req.method, req.url);
    const options = {
      hostname: "localhost",
      port: getPort(),
      path: req.url,
      method: req.method,
    };

    const proxy = http.request(options, (proxyRes) => {
      console.log("Response to proxy", ":" + port, proxyRes.statusCode);
      res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxy);
  });

  proxyServer.listen(port, () => {
    console.log("Proxy server listening :" + port);
  });
  return proxyServer;
};
