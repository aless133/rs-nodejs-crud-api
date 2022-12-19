import cluster from "node:cluster";
import { cpus } from "node:os";
import { request, IncomingMessage } from "node:http";
import { createServer } from "./server";
import { dbCall } from "./db";
import { getBody } from "./common";
import { TRequestHandler, IParsedRequest, IApiReturn, IApiCall, IProcessMsg } from "./types";

let port = 0;

export const initPrimary = (pport: number) => {
  port = pport;
  console.log(`Primary ${process.pid} is running on port :${port}`);
  createServer(port, balanceRequest);
  // Fork workers.
  const numCPUs = cpus().length;
  balancerSetup({ portBegin: port + 1, portEnd: port + numCPUs });
  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork({ PORT: port + i });
    worker.on("message", (msg: IProcessMsg) => {
      console.log(`Primary ${process.pid} on port :${port} got message`, msg);
      if (msg.action === "dbCall") {
        const dbReturn = dbCall(msg.send as IApiCall);
        const msg1: IProcessMsg = { action: "dbReturn", send: msg.send, recv: dbReturn };
        if (msg.resolveId) msg1.resolveId = msg.resolveId;
        console.log(`Primary ${process.pid} on port :${port} answer is`, msg1);
        worker.send(msg1);
      }
    });
  }
};

const balancer = {
  portBegin: 0,
  portEnd: 0,
  portCurrent: 0,
};

export const balancerSetup = ({ portBegin, portEnd }: { portBegin: number; portEnd: number }) => {
  balancer.portBegin = portBegin;
  balancer.portEnd = portEnd;
  balancer.portCurrent = portBegin;
};

export const balanceRequest: TRequestHandler = async (req): Promise<IApiReturn> => {
  console.log("balance to :" + balancer.portCurrent);
  const { method, url, headers } = req;
  return new Promise(async (resolve) => {
    const req1 = request(
      {
        method,
        path: url,
        headers,
        port: balancer.portCurrent,
      },
      async (res1: IncomingMessage) => {
        const res: IApiReturn = { code: res1.statusCode ?? 0, data: await getBody(res1) };
        if (res1.headers["content-type"] === "application/json") {
          res.data = JSON.parse(res.data as string); // что бы не было проблем с кодировками
        }
        resolve(res);
      },
    );

    balancer.portCurrent++;
    if (balancer.portCurrent > balancer.portEnd) balancer.portCurrent = balancer.portBegin;

    req1.end(await getBody(req));
  });
};
