import * as dotenv from "dotenv";
dotenv.config();

import process from "node:process";
import app from "./app/app";

const isSingle = !process.argv.includes("--multi");
const port = parseInt((process.env.PORT || "4000") as string);

process.on("SIGINT", () => {
  console.log("Stopping...");
  process.exit();
});

app.start({ isSingle, port });
