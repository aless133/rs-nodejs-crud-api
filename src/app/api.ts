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

  //error for demo/test
  if (req.method == "GET" && parts[1] === "error") {
    throw Error("Example Server Error");
  }

  //all
  if (req.method == "GET" && parts[1] === "users" && parts.length === 2) {
    return { api: { method: "getAll", params: {} } };
  }

  //single
  else if (req.method == "GET" && parts[1] === "users" && parts.length === 3) {
    return { api: { method: "get", params: { userId: parts[2] } } };
  }

  //new
  if (req.method == "POST" && parts[1] === "users" && parts.length === 2) {
    const { err, json: data } = await jsonBody(req);
    if (err) {
      return { err: { code: 400, message: "Invalid data, no JSON" } };
    }
    return { api: { method: "create", params: {}, data } };
  }

  //update
  if (req.method == "PUT" && parts[1] === "users" && parts.length === 3) {
    const { err, json: data } = await jsonBody(req);
    if (err) {
      return { err: { code: 400, message: "Invalid data, no JSON" } };
    }
    return { api: { method: "update", params: { userId: parts[2] }, data } };
  }

  //delete
  else if (req.method == "DELETE" && parts[1] === "users" && parts.length === 3) {
    return { api: { method: "delete", params: { userId: parts[2] } } };
  }

  //else 404
  return { err: { code: 404, message: "Endpoint not found" } };
};

export const apiReturn = (api: IApiCall, dbRet: IDbReturn): IApiReturn => {
  if (dbRet.err) {
    const ret: IApiReturn = { code: 0, data: { error: dbRet.err } };
    // ret.data.error.message = "Database error: " + ret.data.error.message;
    if (dbRet.err.code === EDbErrors.INVALID_DATA) {
      ret.code = 400;
    } else if (dbRet.err.code === EDbErrors.NOT_FOUND) {
      ret.code = 404;
    }
    return ret;
  } else if (api.method === "create" && dbRet.data) {
    return { code: 201, data: dbRet.data };
  } else if (api.method === "delete") {
    return { code: 204, data: "" };
  } else if (dbRet.data) {
    return { code: 200, data: dbRet.data };
  } else {
    return { code: 200, data: "" };
  }
};

const getBody = (msg: IncomingMessage): Promise<string> => {
  return new Promise((resolve) => {
    const body: Buffer[] = [];
    msg
      .on("data", (chunk: Buffer) => {
        body.push(chunk);
      })
      .on("end", () => {
        const bodyFull = Buffer.concat(body).toString();
        resolve(bodyFull);
      });
  });
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
