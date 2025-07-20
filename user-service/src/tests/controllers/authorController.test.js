import { describe, expect, it, jest, afterEach } from "@jest/globals";
import AuthorController from "../../controllers/authorController.js";

// Mocka a classe AuthorService
jest.mock("../../services/authorService.js");

describe("Testando o AuthorController", () => {
  const mockRequest = (data = {}, params = {}) => ({ body: data, params });
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let controller;

  beforeEach(() => {
    controller = new AuthorController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve listar todos os autores", async () => {
    const authorsMock = [
      { name: "Autor 1", email: "autor1@email.com" },
      { name: "Autor 2", email: "autor2@email.com" },
    ];

    controller.authorService.getAllAuthors = jest
      .fn()
      .mockResolvedValue(authorsMock);

    const req = mockRequest();
    const res = mockResponse();

    await controller.getAllAuthors(req, res);

    expect(controller.authorService.getAllAuthors).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve buscar autor por ID", async () => {
    const authorMock = { name: "Autor 1", email: "autor1@email.com" };
    controller.authorService.getAuthorById = jest
      .fn()
      .mockResolvedValue(authorMock);

    const req = mockRequest({}, { id: "123" });
    const res = mockResponse();

    await controller.getAuthorById(req, res);

    expect(controller.authorService.getAuthorById).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve retornar 404 se autor não for encontrado por ID", async () => {
    controller.authorService.getAuthorById = jest
      .fn()
      .mockRejectedValue(new Error("Author not found"));

    const req = mockRequest({}, { id: "123" });
    const res = mockResponse();

    await controller.getAuthorById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "author_not_found",
      message: "Autor não encontrado",
    });
  });

  it("Deve criar um novo autor", async () => {
    const newAuthor = { name: "Novo Autor", email: "novo@email.com" };
    controller.authorService.createAuthor = jest
      .fn()
      .mockResolvedValue(newAuthor);

    const req = mockRequest(newAuthor);
    const res = mockResponse();

    await controller.createAuthor(req, res);

    expect(controller.authorService.createAuthor).toHaveBeenCalledWith(
      newAuthor
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Autor criado com sucesso!",
      })
    );
  });

  it("Deve atualizar um autor por ID", async () => {
    const updatedAuthor = { name: "Atualizado", email: "atualizado@email.com" };
    controller.authorService.updateAuthor = jest
      .fn()
      .mockResolvedValue(updatedAuthor);

    const req = mockRequest({ name: "Atualizado" }, { id: "123" });
    const res = mockResponse();

    await controller.updateAuthor(req, res);

    expect(controller.authorService.updateAuthor).toHaveBeenCalledWith("123", {
      name: "Atualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Author atualizado com sucesso!",
      })
    );
  });

  it("Deve retornar 404 ao tentar atualizar autor inexistente", async () => {
    controller.authorService.updateAuthor = jest
      .fn()
      .mockRejectedValue(new Error("Author not found"));

    const req = mockRequest({ name: "Falha" }, { id: "000" });
    const res = mockResponse();

    await controller.updateAuthor(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "author_not_found",
      message: "Autor não encontrado",
    });
  });

  it("Deve excluir um autor por ID", async () => {
    controller.authorService.deleteAuthor = jest.fn().mockResolvedValue({});

    const req = mockRequest({}, { id: "123" });
    const res = mockResponse();

    await controller.deleteAuthor(req, res);

    expect(controller.authorService.deleteAuthor).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Autor removido com sucesso!",
    });
  });

  it("Deve retornar 404 ao tentar excluir autor inexistente", async () => {
    controller.authorService.deleteAuthor = jest
      .fn()
      .mockRejectedValue(new Error("Author not found"));

    const req = mockRequest({}, { id: "999" });
    const res = mockResponse();

    await controller.deleteAuthor(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "author_not_found",
      message: "Autor não encontrado",
    });
  });

  it("Deve listar autores por nome", async () => {
    const authorsMock = [{ name: "Nome", email: "email@email.com" }];
    controller.authorService.searchAuthorsByName = jest
      .fn()
      .mockResolvedValue(authorsMock);

    const req = mockRequest({}, { name: "Nome" });
    const res = mockResponse();

    await controller.searchAuthorsByName(req, res);

    expect(controller.authorService.searchAuthorsByName).toHaveBeenCalledWith(
      "Nome"
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("Deve retornar erro ao buscar autores sem nome", async () => {
    controller.authorService.searchAuthorsByName = jest
      .fn()
      .mockRejectedValue(new Error("Name cannot be empty"));

    const req = mockRequest({}, { name: "" });
    const res = mockResponse();

    await controller.searchAuthorsByName(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_name",
      message: "Nome não pode ser vazio",
    });
  });
});
