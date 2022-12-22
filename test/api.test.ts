import request from "supertest";
import server from "../src/index";

describe("Test API", () => {
  test("unknown endpoint", async () => {
    const response = await request(server).get("/dont/know/what");
    expect(response.statusCode).toBe(404);
  });

  test("getAll when empty", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("create bad user", async () => {
    const response = await request(server).post("/api/users").send({ name: "John", age: 30 });
    expect(response.statusCode).toBe(400);
  });

  const user1Data = {
    username: "John",
    age: 30,
    hobbies: ["bike", "swim"],
  };

  test("create new user", async () => {
    const response = await request(server).post("/api/users").send(user1Data);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: expect.any(String), ...user1Data });
  });
});

afterAll(() => {
  server.close();
});
