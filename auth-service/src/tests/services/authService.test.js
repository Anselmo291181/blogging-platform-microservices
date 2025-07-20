import { jest } from "@jest/globals";
import { User } from "../../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// MOCK SETUP
User.findOne = jest.fn();
bcryptjs.compare = jest.fn();
jwt.sign = jest.fn();

// Importar depois de mockar (import dinâmico abaixo do escopo)
import AuthService from "../../services/authService.js";

describe("AuthService", () => {
  const authService = new AuthService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login with valid credentials", async () => {
    const mockUser = {
      id: "abc123",
      email: "john@test.com",
      password: "hashed",
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token");

    const result = await authService.login({
      email: "john@test.com",
      password: "123456",
    });

    expect(result).toHaveProperty("acessToken", "token");
  });

  it("should throw if user is not found", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(
      authService.login({ email: "notfound@test.com", password: "123456" })
    ).rejects.toThrow("Usuário não cadastrado!");
  });

  it("should throw if password does not match", async () => {
    const mockUser = {
      id: "abc123",
      email: "john@test.com",
      password: "hashed",
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    bcryptjs.compare.mockResolvedValue(false);

    await expect(
      authService.login({ email: "john@test.com", password: "wrong" })
    ).rejects.toThrow("Usuário ou senha inválido!");
  });
});
