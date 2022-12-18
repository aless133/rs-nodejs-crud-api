import { dbCall } from "./db";
import { IncomingMessage } from "node:http";
import { TRequestHandler, IParsedRequest, IApiCall, IDbReturn, IApiReturn, IProcessMsg } from "./types";
import process from "node:process";

export enum messages {
  BAD_REQ = "Bad request",
  NOT_FOUND = "Not found",
  SERVER_ERROR = "Server error",
}

export const parseRequest = async (req: IncomingMessage): Promise<IParsedRequest> => {
  if (!req.url) return { err: { code: 404, message: "Endpoint not found" } };
  const parts = req.url.split("/");

  //all
  if (parts[2] === "users" && parts.length === 3) {
    return { api: { method: "getAll" } };
  }

  //single
  else if (parts[2] === "users" && parts.length === 4) {
    return { api: { method: "get", params: { userId: parts[3] } } };
  }

  //else 404
  return { err: { code: 404, message: "Endpoint not found" } };
};

export const apiReturn = (api: IApiCall, dbRet: IDbReturn): IApiReturn => {
  if (dbRet.err) {
    return { code: dbRet.err.code, data: dbRet.err.message };
  } else if (dbRet.data) {
    return { code: 200, data: dbRet.data };
  } else {
    return { code: 200, data: "" };
  }
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

export const sendRequest: TRequestHandler = async (req) => {
  if (!process.send) {
    return { code: 500, data: messages.SERVER_ERROR };
  }
  const parsed = await parseRequest(req);
  if (parsed.err) {
    return { code: parsed.err.code, data: parsed.err.message };
  }
  return new Promise<IApiReturn>((resolve, reject) => {
    const msg: IProcessMsg = { action: "db", payload: parsed.api };
    console.log(`Worker ${process.pid} send message`, msg);
    process.send(msg, (dbRet) => {
      console.log(`Worker ${process.pid} got response`, dbRet);
      resolve(apiReturn(parsed.api, dbRet));
    });
  });
};
