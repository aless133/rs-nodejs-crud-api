import cluster from "node:cluster";
import { Server } from "node:http";
import { initSingle } from "./single";
import { initPrimary } from "./primary";
import { initWorker } from "./worker";
import { TAppStart } from "./types";

const start: TAppStart = ({ isSingle, port }) => {
  let appServer: Server;

  //single
  if (isSingle) {
    appServer = initSingle(port);
  }

  //primary
  else if (cluster.isPrimary) {
    appServer = initPrimary(port);
  }

  //worker
  else {
    appServer = initWorker(parseInt((process.env.PORT || "4444") as string));
    // appServer = initWorker(port);
  }
  return appServer;
};

export default { start };
