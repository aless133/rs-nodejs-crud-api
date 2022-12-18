import { request, IncomingMessage } from "node:http";
import { getBody } from "./common";
import { TRequestHandler, IParsedRequest, IApiReturn, IApiCall } from "./types";

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
  console.log("balancer to :" + balancer.portCurrent);
  const { method, url, headers } = req;
  return new Promise(async (resolve, reject) => {
    const req1 = request(
      {
        method,
        path: url,
        headers,
        port: balancer.portCurrent,
      },
      async (res1: IncomingMessage) => {
        resolve({ code: res1.statusCode ?? 0, data: await getBody(res1) });
      },
    );

    balancer.portCurrent++;
    if (balancer.portCurrent > balancer.portEnd) balancer.portCurrent = balancer.portBegin;

    req1.end(await getBody(req));
  });
};
