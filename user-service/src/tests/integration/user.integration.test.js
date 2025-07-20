import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

process.env.SKIP_AUTH = "true";

import request from "supertest";
import app from "../../app.js";
import {
  connectTestDatabase,
  cleanTestCollection,
  disconnectTestDatabase,
} from "../utils/mongoTestUtil.js";

beforeAll(async () => {
  await connectTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

beforeEach(async () => {
  await cleanTestCollection("users");
});

describe("User Integration Test", () => {
  it("deve registrar um novo usuário", async () => {
    const newUser = {
      name: "Mateus",
      email: "mateus@dev.com",
      password: "123456",
    };

    const response = await request(app).post("/users").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined(); // Validação do ID

    expect(response.body.name).toBe("Mateus");
    expect(response.body.email).toBe("mateus@dev.com");
    expect(response.body).not.toHaveProperty("password");
  });

  it("deve retornar erro ao tentar cadastrar usuário já existente", async () => {
    const user = {
      name: "Mateus",
      email: "mateus@dev.com",
      password: "123456",
    };

    await request(app).post("/users").send(user);
    const response = await request(app).post("/users").send(user);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Usuário já cadastrado!");
  });

  it("deve listar todos os usuários", async () => {
    await request(app).post("/users").send({
      name: "Maria",
      email: "maria@dev.com",
      password: "senha123",
    });

    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("deve retornar um usuário por ID", async () => {
    const res = await request(app).post("/users").send({
      name: "Alan",
      email: "alan@crypto.com",
      password: "crypto123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined(); // ID verificado antes do uso

    const id = res.body.id;
    const getRes = await request(app).get(`/users/${id}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("id", id);
    expect(getRes.body.name).toBe("Alan");
  });

  it("deve atualizar um usuário existente", async () => {
    const res = await request(app).post("/users").send({
      name: "Carla",
      email: "carla@dev.com",
      password: "senha123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined(); // ID validado

    const id = res.body.id;

    const updateRes = await request(app).put(`/users/${id}`).send({
      name: "Carla Souza",
    });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty(
      "message",
      "Usuário atualizado com sucesso!"
    );
    expect(updateRes.body.author.name).toBe("Carla Souza");
  });

  it("deve retornar erro ao tentar atualizar um usuário inexistente", async () => {
    const updateRes = await request(app).put("/users/invalid-id").send({
      name: "Novo Nome",
    });

    expect(updateRes.statusCode).toBe(400);
    expect(updateRes.body).toHaveProperty("error");
  });

  it("deve deletar um usuário existente", async () => {
    const res = await request(app).post("/users").send({
      name: "Carlos",
      email: "carlos@dev.com",
      password: "senha123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined(); // ID validado

    const id = res.body.id;

    const deleteRes = await request(app).delete(`/users/${id}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty(
      "message",
      "Usuário removido com sucesso!"
    );

    const getAfterDelete = await request(app).get(`/users/${id}`);
    expect(getAfterDelete.statusCode).toBe(404);
  });

  it("deve retornar erro ao tentar deletar um usuário inexistente", async () => {
    const deleteRes = await request(app).delete("/users/invalid-id");
    expect(deleteRes.statusCode).toBe(400);
    expect(deleteRes.body).toHaveProperty("error");
  });
});
