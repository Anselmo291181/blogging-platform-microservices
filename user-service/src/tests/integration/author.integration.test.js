import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import app from "../../app.js";
import { author } from "../../models/Author.js";
import {
  connectTestDatabase,
  cleanTestCollection,
  disconnectTestDatabase,
} from "../utils/mongoTestUtil.js";

// Ativa bypass da autenticação durante os testes
process.env.SKIP_AUTH = "true";

beforeAll(async () => {
  await connectTestDatabase();
  await author.syncIndexes();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe("Author Integration Test", () => {
  beforeEach(async () => {
    await cleanTestCollection("authors");
  });

  it("should create a new author", async () => {
    const newAuthor = {
      name: "Ada Lovelace",
      email: "ada@computing.org",
    };

    const response = await request(app).post("/authors").send(newAuthor);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("author");
    expect(response.body.author).toMatchObject({
      name: newAuthor.name,
      email: newAuthor.email,
    });
  });

  it("should return 400 if email already exists", async () => {
    const existingAuthor = {
      name: "Ada Lovelace",
      email: "ada@computing.org",
    };

    await request(app).post("/authors").send(existingAuthor);
    const response = await request(app).post("/authors").send(existingAuthor);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "email_exists");
  });

  it("should return all authors", async () => {
    await request(app).post("/authors").send({
      name: "Grace Hopper",
      email: "grace@navy.mil",
    });

    const response = await request(app).get("/authors");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const found = response.body.find((a) => a.email === "grace@navy.mil");
    expect(found).toBeDefined();
    expect(found.name).toBe("Grace Hopper");
  });

  it("should return an author by ID", async () => {
    const createRes = await request(app).post("/authors").send({
      name: "Alan Turing",
      email: "alan@crypto.org",
    });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.author?.id;
    expect(id).toBeDefined(); // Validação do ID

    const response = await request(app).get(`/authors/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", id);
    expect(response.body.name).toBe("Alan Turing");
  });

  it("should update an author", async () => {
    const createRes = await request(app).post("/authors").send({
      name: "Linus",
      email: "linus@linux.org",
    });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.author?.id;
    expect(id).toBeDefined(); // Validação do ID

    const response = await request(app).put(`/authors/${id}`).send({
      name: "Linus Torvalds",
      email: "linus@linux.org",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.author.name).toBe("Linus Torvalds");
  });

  it("should delete an author", async () => {
    const createRes = await request(app).post("/authors").send({
      name: "Margaret Hamilton",
      email: "hamilton@nasa.org",
    });

    expect(createRes.statusCode).toBe(201);
    const id = createRes.body.author?.id;
    expect(id).toBeDefined(); // Validação do ID

    const response = await request(app).delete(`/authors/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/removido/);

    const getAfterDelete = await request(app).get(`/authors/${id}`);
    expect(getAfterDelete.statusCode).toBe(404);
  });

  it("should search authors by name (case insensitive)", async () => {
    await request(app).post("/authors").send({
      name: "Barbara Liskov",
      email: "barbara@mit.edu",
    });

    const response = await request(app).get("/authors/search/liskov");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toMatch(/liskov/i);
  });

  it("should return 404 if searched name does not match", async () => {
    const response = await request(app).get("/authors/search/notfoundname");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "no_authors_found");
  });

  it("should return 400 if searched name is empty", async () => {
    const response = await request(app).get("/authors/search/%20"); // %20 é espaço
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "invalid_name");
  });
});
