import { IncomingMessage } from "node:http";
import { IParsedRequest, IApiCall, IDbReturn, IApiReturn } from "./types";

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
