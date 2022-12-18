// import { dirname } from "path";
// import { fileURLToPath } from "url";
// export const __dirname = dirname(fileURLToPath(import.meta.url));

import * as dotenv from "dotenv";
dotenv.config();

import process from "node:process";
import cluster from "node:cluster";
import { initSingle } from "./single";
import { initPrimary } from "./primary";
import { initWorker } from "./worker";

const isSingle = !process.argv.includes("--multi");
const port = parseInt((process.env.PORT || "4000") as string);

//single
if (isSingle) {
  initSingle(port);
}

//primary
else if (cluster.isPrimary) {
  initPrimary(port);
}

//worker
else {
  initWorker(port);
}
