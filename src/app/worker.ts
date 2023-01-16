import process from "node:process";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "./server";
import { parseRequest, apiReturn, messages } from "./api";
import { TRequestHandler, IApiReturn, IProcessMsg } from "./types";

let port = 0;

export const initWorker = (pport: number) => {
  port = pport;
  console.log(`Worker ${process.pid} started on port :${port}`);
  const server = createServer(port, sendRequest);
  process.on("message", (msg: IProcessMsg) => {
    console.log(`Worker ${process.pid} on port :${port} got message`, msg);
    if (msg.action === "dbReturn" && msg.resolveId && msg.recv) {
      console.log(`Worker ${process.pid} on port :${port} resolve!`);
      processMsgResolvers[msg.resolveId](apiReturn(msg.send, msg.recv));
      delete processMsgResolvers[msg.resolveId];
    }
  });
  return server;
};

const processMsgResolvers: Record<string, (p: IApiReturn) => void> = {};

export const sendRequest: TRequestHandler = async (req) => {
  const parsed = await parseRequest(req);
  if (parsed.err) {
    return { code: parsed.err.code, data: parsed.err.message };
  } else if (parsed.api) {
    return new Promise<IApiReturn>((resolve) => {
      if (parsed.api) {
        const resolveUuid = uuidv4();
        processMsgResolvers[resolveUuid] = resolve;
        const msg: IProcessMsg = { action: "dbCall", send: parsed.api, resolveId: resolveUuid };
        console.log(`Worker ${process.pid} send message`, msg);
        if (process.send) process.send(msg);
      }
    });
  }
  return { code: 500, data: messages.SERVER_ERROR };
};
