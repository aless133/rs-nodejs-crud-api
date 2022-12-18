import { IncomingMessage } from "node:http";

// import { dirname } from "path";
// import { fileURLToPath } from "url";
// export const __dirname = dirname(fileURLToPath(import.meta.url));

export const getBody = (msg: IncomingMessage): Promise<string> => {
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
