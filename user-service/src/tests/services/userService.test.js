jest.mock("../../repositories/userRepository.js");
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import bcrypt from "bcryptjs";
jest
  .spyOn(bcrypt, "hash")
  .mockImplementation(() => Promise.resolve("hashed-password"));
const { UserService } = await import("../../services/userService.js");

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    const userInput = {
      name: "New User",
      email: "new@email.com",
      password: "123456",
    };

    userService.userRepository.findByEmail = jest.fn().mockResolvedValue(null);
    userService.userRepository.create = jest.fn().mockResolvedValue({
      ...userInput,
      password: "hashed-password",
    });

    const result = await userService.register(userInput);

    expect(userService.userRepository.findByEmail).toHaveBeenCalledWith(
      userInput.email
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 8);
    expect(userService.userRepository.create).toHaveBeenCalledWith({
      name: userInput.name,
      email: userInput.email,
      password: "hashed-password",
    });
    expect(result).toHaveProperty("email", userInput.email);
    expect(result).not.toHaveProperty("password");
  });

  it("should throw if user already exists during register", async () => {
    const existingUser = { email: "exists@email.com" };

    userService.userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue(existingUser);

    await expect(userService.register(existingUser)).rejects.toThrow(
      "Usuário já cadastrado!"
    );
  });

  it("should return all users", async () => {
    const users = [
      { name: "User 1", email: "u1@email.com", password: "x" },
      { name: "User 2", email: "u2@email.com", password: "y" },
    ];

    userService.userRepository.findAll = jest.fn().mockResolvedValue(users);

    const result = await userService.getAllUsers();
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty("email", "u1@email.com");
  });

  it("should return a user by ID", async () => {
    const user = {
      id: "123",
      name: "Find Me",
      email: "me@email.com",
      password: "x",
    };

    userService.userRepository.findById = jest.fn().mockResolvedValue(user);

    const result = await userService.getUserById("123");

    expect(userService.userRepository.findById).toHaveBeenCalledWith("123");
    expect(result).toHaveProperty("name", "Find Me");
  });

  it("should throw if user not found by ID", async () => {
    userService.userRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(userService.getUserById("naoexiste")).rejects.toThrow(
      "Usuário não encontrado!"
    );
  });

  it("should update a user", async () => {
    const updated = {
      id: "456",
      name: "Updated User",
      email: "u@e.com",
      password: "hashed",
    };

    userService.userRepository.update = jest.fn().mockResolvedValue(updated);

    const result = await userService.updateUser("456", {
      name: "Updated User",
    });

    expect(userService.userRepository.update).toHaveBeenCalledWith("456", {
      name: "Updated User",
    });
    expect(result).toHaveProperty("name", "Updated User");
  });

  it("should throw if user not found during update", async () => {
    userService.userRepository.update = jest.fn().mockResolvedValue(null);

    await expect(
      userService.updateUser("notfound", { name: "X" })
    ).rejects.toThrow("Usuário não encontrado!");
  });

  it("should delete a user", async () => {
    const deletedUser = { _id: "999", name: "Delete Me" };

    userService.userRepository.delete = jest
      .fn()
      .mockResolvedValue(deletedUser);

    const result = await userService.deleteUser("999");

    expect(userService.userRepository.delete).toHaveBeenCalledWith("999");
    expect(result).toEqual(deletedUser);
  });

  it("should throw if user not found during delete", async () => {
    userService.userRepository.delete = jest.fn().mockResolvedValue(null);

    await expect(userService.deleteUser("none")).rejects.toThrow(
      "Usuário não encontrado!"
    );
  });
});
