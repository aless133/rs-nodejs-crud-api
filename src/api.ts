import db from "./db";
import { IncomingMessage } from "node:http";
import { IApi, TJSONValue } from "./types";

export enum messages {
  BAD_REQ = "Bad request",
  NOT_FOUND = "Not found",
  SERVER_ERROR = "Server error",
}

export function handleRequest(req: IncomingMessage): IApi {
  let ret: IApi = { code: 500, data: messages.SERVER_ERROR },
    data: TJSONValue = false;
  const parts = req.url!.split("/");

  //all
  if (parts[2] === "users" && parts.length === 3) {
    data = db.getAll();
  }

  //single
  else if (parts[2] === "users" && parts.length === 4) {
    data = db.get(parts[4]);
  }

  //else 404
  else {
    ret = { code: 404, data: "Endpoint not found" };
  }
  if (!!data) {
    ret = { code: 200, data };
  }

  return ret;
}

function parseUrl(url: string) {
  const parts = url.split("/");
}
