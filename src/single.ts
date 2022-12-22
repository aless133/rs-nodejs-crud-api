import process from "node:process";
import { createServer } from "./server";
import { dbCall } from "./db";
import { IncomingMessage } from "node:http";
import { TRequestHandler, IParsedRequest, IApiCall, IDbReturn, IApiReturn, IProcessMsg } from "./types";
import { parseRequest, apiReturn, messages } from "./api";

let port = 0;

export const initSingle = (pport: number) => {
  port = pport;
  console.log(`Single ${process.pid} is running on port :${port}`);
  const server = createServer(port, handleRequest);
  return server;
};

export const handleRequest: TRequestHandler = async (req) => {
  const parsed = await parseRequest(req);
  if (parsed.err) {
    return { code: parsed.err.code, data: parsed.err.message };
  } else if (parsed.api) {
    const dbRet = dbCall(parsed.api);
    return apiReturn(parsed.api, dbRet);
  }
  return { code: 500, data: messages.SERVER_ERROR };
};
