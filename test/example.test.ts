import request from "supertest";
import app from "../src/app/app";
import td from "./test.data";

const server = app.start(td.startApp);

afterAll(() => {
  server.close();
});

describe("Example Test", () => {
  test("getAll when empty", async () => {
    const response = await request(server).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  let id1 = "";
  test("create new user", async () => {
    const response = await request(server).post("/api/users").send(td.userData1);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: expect.any(String), ...td.userData1 });
    id1 = response.body.id;
  });

  test("get user", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: id1, ...td.userData1 });
  });

  test("delete user", async () => {
    const response = await request(server).delete(`/api/users/${id1}`);
    expect(response.statusCode).toBe(204);
  });

  test("get deleted user", async () => {
    const response = await request(server).get(`/api/users/${id1}`);
    expect(response.statusCode).toBe(404);
  });

});
