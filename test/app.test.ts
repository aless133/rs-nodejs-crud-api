import request from "supertest";
import app from "../src/app/app";
import td from "./test.data";

const server = app.start(td.startApp);

afterAll(() => {
  server.close();
});

describe("Test CRUD API", () => {
  test("unknown endpoint", async () => {
    const response = await request(server).get("/dont/know/what");
    expect(response.statusCode).toBe(404);
  });

  test("getAll when empty", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  const user1Bad = { name: "John", age: 30 };
  test("create bad user", async () => {
    const response = await request(server).post("/api/users").send(user1Bad);
    expect(response.statusCode).toBe(400);
  });

  const user1Data = {
    username: "John",
    age: 30,
    hobbies: ["bike", "swim"],
  };

  let id1 = "";
  test("create new user", async () => {
    const response = await request(server).post("/api/users").send(user1Data);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: expect.any(String), ...user1Data });
    id1 = response.body.id;
  });

  test("get bad id user", async () => {
    const response = await request(server).get(`/api/users/123`);
    expect(response.statusCode).toBe(400);
  });

  test("get not found user", async () => {
    const response = await request(server).get(`/api/users/5bfaaa38-6fa1-4eb2-b579-74e04cd2c058`);
    expect(response.statusCode).toBe(404);
  });

  test("get user", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id1, ...user1Data });
  });
});
