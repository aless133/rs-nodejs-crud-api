import cluster from "node:cluster";
import { cpus } from "node:os";
import { createProxy } from "./server";
import { dbCall } from "./db";
import { IApiCall, IProcessMsg } from "./types";

let port = 0;

export const initPrimary = (pport: number) => {
  port = pport;
  console.log(`Primary ${process.pid} is running on port :${port}`);
  const server = createProxy(port, balancerPort);

  // Fork workers.
  const numCPUs = cpus().length;
  balancerSetup({ portBegin: port + 1, portEnd: port + numCPUs });
  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork({ PORT: port + i, QWE: 15 });
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
  return server;
};

const balancer = {
  portBegin: 0,
  portEnd: 0,
  portCurrent: 0,
};

const balancerSetup = ({ portBegin, portEnd }: { portBegin: number; portEnd: number }) => {
  balancer.portBegin = portBegin;
  balancer.portEnd = portEnd;
  balancer.portCurrent = portBegin;
};

export const balancerPort = () => {
  const port = balancer.portCurrent++;
  if (balancer.portCurrent > balancer.portEnd) balancer.portCurrent = balancer.portBegin;
  return port;
};
