import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import nock from "nock";
import {
  connectTestDatabase,
  cleanTestCollection,
  disconnectTestDatabase,
} from "../utils/mongoTestUtil.js";

process.env.SKIP_AUTH = "true";

beforeAll(async () => {
  await connectTestDatabase();
});

afterAll(async () => {
  await disconnectTestDatabase();
});

describe("Post Integration Test", () => {
  beforeEach(async () => {
    await cleanTestCollection("posts");
    nock.cleanAll(); // remove mocks antigos
  });

  const authorId = new mongoose.Types.ObjectId().toString();

  const mockAuthorService = () => {
    nock("http://localhost:3001")
      .get(`/authors/${authorId}`)
      .reply(200, {
        author: {
          id: authorId,
          name: "Author Test",
          email: "author@test.com",
        },
      });
  };

  it("should create a new post", async () => {
    mockAuthorService();

    const response = await request(app).post("/posts").send({
      title: "New Post",
      description: "This is a test post",
      author: authorId,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("post");
    expect(response.body.post.title).toBe("New Post");
  });

  it("should return 404 if author is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    // Mock 404 para autor inexistente
    nock("http://localhost:3001").get(`/authors/${fakeId}`).reply(404, {
      error: "author_not_found",
    });

    const response = await request(app).post("/posts").send({
      title: "No Author",
      description: "Fails",
      author: fakeId,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "author_not_found");
  });

  it("should return all posts", async () => {
    mockAuthorService();

    await request(app).post("/posts").send({
      title: "Post 1",
      description: "Desc 1",
      author: authorId,
    });

    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a post by ID", async () => {
    mockAuthorService();

    const createRes = await request(app).post("/posts").send({
      title: "Get By ID",
      description: "Sample",
      author: authorId,
    });

    const postId = createRes.body.post?.id;
    expect(postId).toBeDefined();

    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Get By ID");
  });

  it("should return 404 if post not found by ID", async () => {
    const response = await request(app).get(
      `/posts/${new mongoose.Types.ObjectId()}`
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "post_not_found");
  });

  it("should update a post", async () => {
    mockAuthorService();

    const createRes = await request(app).post("/posts").send({
      title: "To Update",
      description: "Old",
      author: authorId,
    });

    const postId = createRes.body.post.id;

    const response = await request(app).put(`/posts/${postId}`).send({
      title: "Updated Title",
      description: "Updated description",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.post.title).toBe("Updated Title");
  });

  it("should delete a post", async () => {
    mockAuthorService();

    const createRes = await request(app).post("/posts").send({
      title: "To Delete",
      author: authorId,
    });

    const postId = createRes.body.post.id;

    const deleteRes = await request(app).delete(`/posts/${postId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toMatch(/removido/);

    const afterDelete = await request(app).get(`/posts/${postId}`);
    expect(afterDelete.statusCode).toBe(404);
  });

  it("should search posts by keyword (case insensitive)", async () => {
    mockAuthorService();

    await request(app).post("/posts").send({
      title: "Learning React",
      description: "Front-end framework",
      author: authorId,
    });

    const response = await request(app).get("/posts/search/react");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].title).toMatch(/react/i);
  });

  it("should return 404 if no posts match the keyword", async () => {
    const response = await request(app).get("/posts/search/unknownword");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "no_posts_found");
  });

  it("should return 400 if keyword is empty", async () => {
    const response = await request(app).get("/posts/search/%20");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "invalid_keyword");
  });
});
