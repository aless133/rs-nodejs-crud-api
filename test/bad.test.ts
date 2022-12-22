import request from "supertest";
import app from "../src/app/app";
import td from "./test.data";

const server = app.start(td.startApp);

afterAll(() => {
  server.close();
});

describe("Error test CRUD API", () => {
  test("unknown endpoint", async () => {
    const response = await request(server).get("/dont/know/what");
    expect(response.statusCode).toBe(404);
  });

  test("create bad user", async () => {
    const response = await request(server).post("/api/users").send(td.userBad1);
    expect(response.statusCode).toBe(400);
  });

  test("get bad id user", async () => {
    const response = await request(server).get(`/api/users/${td.uuid1}`);
    expect(response.statusCode).toBe(400);
  });

  test("get not found user", async () => {
    const response = await request(server).get(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(404);
  });

  test("update bad id user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid1}`).send();
    expect(response.statusCode).toBe(400);
  });

  test("update not found user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(404);
  });

  test("delete bad id user", async () => {
    const response = await request(server).delete(`/api/users/${td.uuid1}`);
    expect(response.statusCode).toBe(400);
  });

  test("delete not found user", async () => {
    const response = await request(server).delete(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(404);
  });
});
