import app from "../src/app/app";

const serverArg = process.argv.find((e) => e.startsWith("-server="));
let serverStarted = false;
let server: string | ReturnType<typeof app.start> = "";
if (serverArg) {
  serverStarted = true;
  server = serverArg.split("=")[1];
} else {
  server = app.start({ isSingle: true, port: 4000 });
  afterAll(() => {
    (server as ReturnType<typeof app.start>).close();
  });
}

const userBad1 = { name: "John", age: 30 };
const userData1 = {
  username: "John",
  age: 30,
  hobbies: ["bike", "swim"],
};
const userData2 = {
  username: "John",
  age: 33,
  hobbies: ["sleep"],
};
const uuid1bad = "123";
const uuid2 = "5bfaaa38-6fa1-4eb2-b579-74e04cd2c058"; //valid but non exists

export default { serverStarted, server, userBad1, userData1, userData2, uuid1bad, uuid2 };
