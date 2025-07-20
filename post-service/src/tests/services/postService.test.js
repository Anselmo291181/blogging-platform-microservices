import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { PostService } from "../../services/postService.js";

jest.mock("../../repositories/postRepository.js");

describe("PostService", () => {
  let postService;

  beforeEach(() => {
    postService = new PostService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all posts", async () => {
    const postsMock = [{ title: "Post 1", author: "123" }];
    postService.postRepository.findAll = jest.fn().mockResolvedValue(postsMock);

    const result = await postService.getAllPosts();
    expect(result).toEqual(postsMock);
  });

  it("should get a post by ID", async () => {
    const post = { id: "abc", title: "Um Post", author: "autor" };
    postService.postRepository.findById = jest.fn().mockResolvedValue(post);

    const result = await postService.getPostById("abc");
    expect(result).toEqual(post);
  });

  it("should throw if post not found by ID", async () => {
    postService.postRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(postService.getPostById("inexistente")).rejects.toThrow(
      "Post not found"
    );
  });

  it("should update a post", async () => {
    const updatedPost = {
      id: "xyz",
      title: "Atualizado",
      description: "Novo conteúdo",
      author: "autor",
    };

    postService.postRepository.update = jest
      .fn()
      .mockResolvedValue(updatedPost);

    const result = await postService.updatePost("xyz", {
      title: "Atualizado",
    });

    expect(result).toEqual(updatedPost);
    expect(postService.postRepository.update).toHaveBeenCalledWith("xyz", {
      title: "Atualizado",
    });
  });

  it("should throw if post not found during update", async () => {
    postService.postRepository.update = jest.fn().mockResolvedValue(null);

    await expect(
      postService.updatePost("xyz", { title: "Nada" })
    ).rejects.toThrow("Post not found");
  });

  it("should delete a post", async () => {
    postService.postRepository.delete = jest
      .fn()
      .mockResolvedValue({ id: "123" });

    const result = await postService.deletePost("123");
    expect(result.id).toBe("123");
  });

  it("should throw if post not found during delete", async () => {
    postService.postRepository.delete = jest.fn().mockResolvedValue(null);

    await expect(postService.deletePost("inexistente")).rejects.toThrow(
      "Post not found"
    );
  });

  it("should search posts by keyword", async () => {
    const posts = [{ title: "Node.js" }];
    postService.postRepository.searchByKeyword = jest
      .fn()
      .mockResolvedValue(posts);

    const result = await postService.searchPostsByKeyword("node");
    expect(result).toEqual(posts);
  });

  it("should throw if keyword is empty", async () => {
    await expect(postService.searchPostsByKeyword("")).rejects.toThrow(
      "Keyword cannot be empty"
    );
  });
});
