import {
  describe,
  expect,
  it,
  jest,
  afterEach,
  beforeEach,
} from "@jest/globals";
import UserController from "../../controllers/userController.js";

// Mocka a UserService
jest.mock("../../services/userService.js");

describe("Testando o UserController", () => {
  const mockRequest = (body = {}, params = {}, user = {}) => ({
    body,
    params,
    user,
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let controller;

  beforeEach(() => {
    controller = new UserController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Deve registrar um novo usuário", async () => {
    const newUser = {
      name: "Mateus",
      email: "mateus@email.com",
      password: "123456",
    };
    controller.userService.register = jest.fn().mockResolvedValue({
      id: "1",
      name: "Mateus",
      email: "mateus@email.com",
    });

    const req = mockRequest(newUser);
    const res = mockResponse();

    await controller.register(req, res);

    expect(controller.userService.register).toHaveBeenCalledWith(newUser);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Mateus" })
    );
  });

  it("Deve retornar erro ao registrar usuário já existente", async () => {
    controller.userService.register = jest
      .fn()
      .mockRejectedValue(new Error("Usuário já cadastrado!"));

    const req = mockRequest({
      name: "Mateus",
      email: "mateus@email.com",
      password: "123456",
    });
    const res = mockResponse();

    await controller.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário já cadastrado!" });
  });

  it("Deve listar todos os usuários", async () => {
    const users = [
      { id: "1", name: "Mateus", email: "mateus@email.com" },
      { id: "2", name: "Maria", email: "maria@email.com" },
    ];

    controller.userService.getAllUsers = jest.fn().mockResolvedValue(users);

    const req = mockRequest();
    const res = mockResponse();

    await controller.getAllUsers(req, res);

    expect(controller.userService.getAllUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("Deve buscar usuário por ID", async () => {
    const user = { id: "1", name: "Mateus", email: "mateus@email.com" };
    controller.userService.getUserById = jest.fn().mockResolvedValue(user);

    const req = mockRequest({}, { id: "1" });
    const res = mockResponse();

    await controller.getUserById(req, res);

    expect(controller.userService.getUserById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("Deve retornar 404 se usuário não for encontrado", async () => {
    controller.userService.getUserById = jest
      .fn()
      .mockRejectedValue(new Error("Usuário não encontrado!"));

    const req = mockRequest({}, { id: "999" });
    const res = mockResponse();

    await controller.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado!" });
  });

  it("Deve atualizar um usuário", async () => {
    const updated = {
      id: "1",
      name: "Atualizado",
      email: "atualizado@email.com",
    };
    controller.userService.updateUser = jest.fn().mockResolvedValue(updated);

    const req = mockRequest({ name: "Atualizado" }, { id: "1" });
    const res = mockResponse();

    await controller.updateUser(req, res);

    expect(controller.userService.updateUser).toHaveBeenCalledWith("1", {
      name: "Atualizado",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Usuário atualizado com sucesso!" })
    );
  });

  it("Deve retornar erro ao atualizar usuário inexistente", async () => {
    controller.userService.updateUser = jest
      .fn()
      .mockRejectedValue(new Error("Usuário não encontrado!"));

    const req = mockRequest({ name: "Falhou" }, { id: "999" });
    const res = mockResponse();

    await controller.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado!" });
  });

  it("Deve deletar um usuário", async () => {
    controller.userService.deleteUser = jest.fn().mockResolvedValue({});

    const req = mockRequest({}, { id: "1" });
    const res = mockResponse();

    await controller.deleteUser(req, res);

    expect(controller.userService.deleteUser).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário removido com sucesso!",
    });
  });

  it("Deve retornar erro ao deletar usuário inexistente", async () => {
    controller.userService.deleteUser = jest
      .fn()
      .mockRejectedValue(new Error("Usuário não encontrado!"));

    const req = mockRequest({}, { id: "999" });
    const res = mockResponse();

    await controller.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado!" });
  });
});
