// import { dirname } from "path";
// import { fileURLToPath } from "url";
// export const __dirname = dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config();

import process from "node:process";
import cluster from "node:cluster";
import { cpus } from "node:os";
// import http from "node:http";
// import fsPromises from "node:fs/promises";
// import { __dirname } from "./common";
// import db from "./db";
import { IProcessMsg, IApiCall } from "./types";
import { createServer } from "./server";
import { handleRequest, sendRequest } from "./api";
import { balancerSetup, balanceRequest } from "./balancer";
import { dbCall } from "./db";

const isSingle = !process.argv.includes("--multi");
const port = parseInt((process.env.PORT || "4000") as string);

// import { fork } from "node:child_process";
// const w1 = fork(__dirname + "/worker.ts");
// const w2 = fork(__dirname + "/worker.ts");
// w1.send("slow");
// w2.send("fast");
// w2.send("fastest");
// w1.on("message", (code) => console.log(`Message1 to parent: ${code}`));
// w2.on("message", (code) => console.log(`Message2 to parent: ${code}`));

//single
if (isSingle) {
  console.log(`Single ${process.pid} is running`);
  const server = createServer(port, handleRequest);
}

//primary
else if (cluster.isPrimary) {
  const workers = [];
  console.log(`Primary ${process.pid} is running`);
  const server = createServer(port, balanceRequest);
  // Fork workers.
  const numCPUs = cpus().length;
  balancerSetup({ portBegin: port + 1, portEnd: port + numCPUs });
  for (let i = 1; i <= numCPUs; i++) {
    const worker = cluster.fork({ PORT: port + i });
    worker.on("message", (msg: IProcessMsg) => {
      if (msg.action === "dbCall") {
        const dbReturn = dbCall(msg.payload as IApiCall);
        worker.send({action:"dbReturn",payload:dbReturn});
      }
    });
  }
}

//worker
else {
  console.log(`Worker ${process.pid} started on port :${port}`);
  const server = createServer(port, sendRequest);
}
