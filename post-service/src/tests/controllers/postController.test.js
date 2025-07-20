import {
  describe,
  expect,
  it,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";
import PostController from "../../controllers/postController.js";

// Mocka o serviço
jest.mock("../../services/postService.js");

describe("Testando o PostController", () => {
  const mockRequest = (body = {}, params = {}) => ({ body, params });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let controller;

  beforeEach(() => {
    controller = new PostController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve listar todos os posts", async () => {
    const postsMock = [
      { title: "Post 1", description: "Desc", author: { name: "Autor" } },
      { title: "Post 2", description: "Desc", author: { name: "Autor" } },
    ];
    controller.postService.getAllPosts = jest.fn().mockResolvedValue(postsMock);

    const req = mockRequest();
    const res = mockResponse();

    await controller.getAllPosts(req, res);

    expect(controller.postService.getAllPosts).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve criar um novo post", async () => {
    const newPost = {
      title: "Novo Post",
      description: "Descrição",
      author: { name: "Autor", email: "email@email.com" },
    };
    controller.postService.createPost = jest.fn().mockResolvedValue(newPost);

    const req = mockRequest(newPost);
    const res = mockResponse();

    await controller.createPost(req, res);

    expect(controller.postService.createPost).toHaveBeenCalledWith(newPost);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Post criado com sucesso!" })
    );
  });

  it("Deve retornar erro 404 se autor não for encontrado ao criar post", async () => {
    controller.postService.createPost = jest
      .fn()
      .mockRejectedValue(new Error("Author not found"));

    const req = mockRequest({ title: "Sem autor", author: "id" });
    const res = mockResponse();

    await controller.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "author_not_found",
      message: "Autor não encontrado",
    });
  });

  it("Deve retornar post por ID", async () => {
    const postMock = { title: "Título", description: "Descrição", author: {} };
    controller.postService.getPostById = jest.fn().mockResolvedValue(postMock);

    const req = mockRequest({}, { id: "abc" });
    const res = mockResponse();

    await controller.getPostById(req, res);

    expect(controller.postService.getPostById).toHaveBeenCalledWith("abc");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve retornar 404 se post não encontrado por ID", async () => {
    controller.postService.getPostById = jest
      .fn()
      .mockRejectedValue(new Error("Post not found"));

    const req = mockRequest({}, { id: "123" });
    const res = mockResponse();

    await controller.getPostById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "post_not_found",
      message: "Post não encontrado",
    });
  });

  it("Deve atualizar um post", async () => {
    const updated = { title: "Atualizado", author: {} };
    controller.postService.updatePost = jest.fn().mockResolvedValue(updated);

    const req = mockRequest({ title: "Atualizado" }, { id: "xyz" });
    const res = mockResponse();

    await controller.updatePost(req, res);

    expect(controller.postService.updatePost).toHaveBeenCalledWith("xyz", {
      title: "Atualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Post atualizado com sucesso!" })
    );
  });

  it("Deve retornar erro 404 ao tentar atualizar post inexistente", async () => {
    controller.postService.updatePost = jest
      .fn()
      .mockRejectedValue(new Error("Post not found"));

    const req = mockRequest({ title: "X" }, { id: "abc" });
    const res = mockResponse();

    await controller.updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "post_not_found",
      message: "Post não encontrado",
    });
  });

  it("Deve deletar um post", async () => {
    controller.postService.deletePost = jest.fn().mockResolvedValue({});

    const req = mockRequest({}, { id: "abc" });
    const res = mockResponse();

    await controller.deletePost(req, res);

    expect(controller.postService.deletePost).toHaveBeenCalledWith("abc");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Post removido com sucesso!",
    });
  });

  it("Deve retornar erro 404 ao deletar post inexistente", async () => {
    controller.postService.deletePost = jest
      .fn()
      .mockRejectedValue(new Error("Post not found"));

    const req = mockRequest({}, { id: "000" });
    const res = mockResponse();

    await controller.deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "post_not_found",
      message: "Post não encontrado",
    });
  });

  it("Deve buscar posts por palavra-chave", async () => {
    const posts = [{ title: "React", author: {} }];
    controller.postService.searchPostsByKeyword = jest
      .fn()
      .mockResolvedValue(posts);

    const req = mockRequest({}, { keyword: "React" });
    const res = mockResponse();

    await controller.findPostsByKeyword(req, res);

    expect(controller.postService.searchPostsByKeyword).toHaveBeenCalledWith(
      "React"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve retornar erro 400 se a keyword estiver vazia", async () => {
    controller.postService.searchPostsByKeyword = jest
      .fn()
      .mockRejectedValue(new Error("Keyword cannot be empty"));

    const req = mockRequest({}, { keyword: "" });
    const res = mockResponse();

    await controller.findPostsByKeyword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_keyword",
      message: "Palavra-chave não pode ser vazia",
      example: "GET /posts/search/react",
    });
  });

  it("Deve retornar erro 404 se nenhum post for encontrado pela palavra-chave", async () => {
    controller.postService.searchPostsByKeyword = jest
      .fn()
      .mockResolvedValue([]);

    const req = mockRequest({}, { keyword: "inexistente" });
    const res = mockResponse();

    await controller.findPostsByKeyword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "no_posts_found",
      message: "Nenhum post encontrado com a palavra-chave informada!",
      keyword: "inexistente",
    });
  });
});
