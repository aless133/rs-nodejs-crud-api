import { IncomingMessage } from "node:http";
import { IParsedRequest, IApiCall, IDbReturn, IApiReturn, EDbErrors } from "./types";
import { getBody } from "./common";

export enum messages {
  BAD_REQ = "Bad request",
  NOT_FOUND = "Not found",
  SERVER_ERROR = "Server error",
}

export const parseRequest = async (req: IncomingMessage): Promise<IParsedRequest> => {
  if (!req.url) return { err: { code: 404, message: "Endpoint not found" } };
  const parts = req.url.split("/").filter((e) => !!e);

  // /api/error for demo/test
  if (parts[1] === "error") {
    throw Error("Example Server Error");
  }

  // /api/users
  if (parts[1] === "users" && parts.length === 2) {
    if (req.method == "GET") {
      return { api: { method: "getAll", params: {} } };
    }
    if (req.method == "POST") {
      const { err, json: data } = await jsonBody(req);
      if (err) {
        return { err: { code: 400, message: "Invalid data, no JSON" } };
      }
      return { api: { method: "create", params: {}, data } };
    }
    return { err: { code: 400, message: "Bad method" } };
  }

  // /api/users/123
  else if (parts[1] === "users" && parts.length === 3) {
    if (req.method == "GET") {
      return { api: { method: "get", params: { userId: parts[2] } } };
    } else if (req.method == "DELETE") {
      return { api: { method: "delete", params: { userId: parts[2] } } };
    } else if (req.method == "PUT") {
      const { err, json: data } = await jsonBody(req);
      if (err) {
        return { err: { code: 400, message: "Invalid data, no JSON" } };
      }
      return { api: { method: "update", params: { userId: parts[2] }, data } };
    }
    return { err: { code: 400, message: "Bad method" } };
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
  } else if (api.method === "delete") {
    return { code: 204, data: "" };
  } else {
    return { code: 200, data: "" };
  }
};

const jsonBody = async (req: IncomingMessage) => {
  const text = await getBody(req);
  let err = false,
    json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    err = true;
  }
  return { err, json };
};
