import { IncomingMessage } from "node:http";
import { IParsedRequest, IApiCall, IDbReturn, IApiReturn, EDbErrors } from "./types";

export enum messages {
  BAD_REQ = "Bad request",
  NOT_FOUND = "Not found",
  SERVER_ERROR = "Server error",
}

export const parseRequest = async (req: IncomingMessage): Promise<IParsedRequest> => {
  if (!req.url) return { err: { code: 404, message: "Endpoint not found" } };
  const parts = req.url.split("/").filter((e) => !!e);

  //all
  if (parts[1] === "users" && parts.length === 2) {
    return { api: { method: "getAll", params: {} } };
  }

  //single
  else if (parts[1] === "users" && parts.length === 3) {
    return { api: { method: "get", params: { userId: parts[2] } } };
  }

  //else 404
  return { err: { code: 404, message: "Endpoint not found" } };
};

export const apiReturn = (api: IApiCall, dbRet: IDbReturn): IApiReturn => {
  if (dbRet.err) {
    const ret: IApiReturn = { code: 0, data: "Database error: " + dbRet.err.message };
    if (dbRet.err.code === EDbErrors.INVALID_DATA) {
      ret.code = 400;
    } else if (dbRet.err.code === EDbErrors.NOT_FOUND) {
      ret.code = 404;
    }
    return ret;
  } else if (dbRet.data) {
    return { code: 200, data: dbRet.data };
  } else {
    return { code: 200, data: "" };
  }
};
