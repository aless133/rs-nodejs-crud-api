import request from "supertest";
import td from "./test.data";

const server = td.server;

describe("Test CRUD API", () => {
  test("getAll when empty", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("create bad user", async () => {
    const response = await request(server).post("/api/users").send(td.userBad1);
    expect(response.statusCode).toBe(400);
  });

  test("getAll after bad creation", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  let id1 = "";
  test("create new user 1", async () => {
    const response = await request(server).post("/api/users").send(td.userData1);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String), ...td.userData1 });
    id1 = response.body.id;
  });

  test("get user", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id1, ...td.userData1 });
  });

  let id2 = "";
  test("create new user 2", async () => {
    const response = await request(server).post("/api/users").send(td.userData1);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: expect.any(String), ...td.userData1 });
    id2 = response.body.id;
  });

  test("getAll after 2 create", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("update user 1", async () => {
    const response = await request(server).put(`/api/users/${id1}`).send(td.userData2);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id1, ...td.userData2 });
  });

  test("get user 1 after update", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id1, ...td.userData2 });
  });

  test("delete user 1", async () => {
    const response = await request(server).delete(`/api/users/${id1}`);
    expect(response.statusCode).toBe(204);
  });

  test("getAll after 1 delete", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("get deleted user", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(404);
  });

  test("get the only user", async () => {
    const response = await request(server).get(`/api/users/${id2}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id2, ...td.userData1 });
  });

  test("delete user 2", async () => {
    const response = await request(server).delete(`/api/users/${id2}`);
    expect(response.statusCode).toBe(204);
  });

  test("getAll after 2 delete", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
