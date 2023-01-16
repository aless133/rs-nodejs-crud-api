import request from "supertest";
import td from "./test.data";

const server = td.server;

describe("Error/bad requests test CRUD API", () => {
  test("unknown endpoint", async () => {
    const response = await request(server).get("/dont/know/what");
    expect(response.statusCode).toBe(404);
  });

  test("test server errror", async () => {
    const response = await request(server).get("/api/error");
    expect(response.statusCode).toBe(500);
  });

  test("create on bad route", async () => {
    const response = await request(server).post("/api/users/123").send(td.userData1);
    expect(response.statusCode).toBe(404);
  });

  test("create nojson user", async () => {
    const response = await request(server).post("/api/users").send("asdasda");
    expect(response.statusCode).toBe(400);
  });

  test("create bad user", async () => {
    const response = await request(server).post("/api/users").send(td.userBad1);
    expect(response.statusCode).toBe(400);
  });

  test("get bad id user", async () => {
    const response = await request(server).get(`/api/users/${td.uuid1bad}`);
    expect(response.statusCode).toBe(400);
  });

  test("get not found user", async () => {
    const response = await request(server).get(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(404);
  });

  test("update on bad route", async () => {
    const response = await request(server).put(`/api/users`).send(td.userData1);
    expect(response.statusCode).toBe(404);
  });

  test("update bad id user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid1bad}`).send(td.userData1);
    expect(response.statusCode).toBe(400);
  });

  test("update no data user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(400);
  });

  test("update bad data user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid2}`).send(td.userBad1);
    expect(response.statusCode).toBe(400);
  });

  test("update not found user", async () => {
    const response = await request(server).put(`/api/users/${td.uuid2}`).send(td.userData1);
    expect(response.statusCode).toBe(404);
  });

  test("delete on bad route", async () => {
    const response = await request(server).delete(`/api/users`);
    expect(response.statusCode).toBe(404);
  });

  test("delete bad id user", async () => {
    const response = await request(server).delete(`/api/users/${td.uuid1bad}`);
    expect(response.statusCode).toBe(400);
  });

  test("delete not found user", async () => {
    const response = await request(server).delete(`/api/users/${td.uuid2}`);
    expect(response.statusCode).toBe(404);
  });
});
