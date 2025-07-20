import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import { User } from "../../models/User.js";
import bcryptjs from "bcryptjs";
import {
  connectTestDatabase,
  disconnectTestDatabase,
  cleanTestCollection,
} from "../utils/mongoTestUtil.js";

beforeAll(async () => {
  await connectTestDatabase();
  await User.syncIndexes?.(); // compatível com mongoose 7+
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe("Auth Integration Test", () => {
  beforeEach(async () => {
    await cleanTestCollection("users");
  });

  it("should login successfully with valid credentials", async () => {
    const password = await bcryptjs.hash("123456", 10);
    await User.create({
      name: "John",
      email: "john@test.com",
      password,
    });

    const response = await request(app).post("/auth/login").send({
      email: "john@test.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("acessToken");
  });

  it("should return 401 if email is not registered", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "notfound@test.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 401 if password is incorrect", async () => {
    const password = await bcryptjs.hash("123456", 10);
    await User.create({
      name: "John",
      email: "john@test.com",
      password,
    });

    const response = await request(app).post("/auth/login").send({
      email: "john@test.com",
      password: "wrong",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
