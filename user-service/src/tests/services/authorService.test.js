import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { AuthorService } from "../../services/authorService.js";
import { AuthorRepository } from "../../repositories/authorRepository.js";

jest.mock("../../repositories/authorRepository.js");

describe("AuthorService", () => {
  let authorService;

  beforeEach(() => {
    authorService = new AuthorService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all authors", async () => {
    const authorsMock = [{ name: "Grace", email: "grace@navy.mil" }];
    authorService.authorRepository.findAll = jest
      .fn()
      .mockResolvedValue(authorsMock);

    const result = await authorService.getAllAuthors();
    expect(result).toEqual(authorsMock);
  });

  it("should get author by ID", async () => {
    const authorMock = { name: "Ada", email: "ada@org" };
    authorService.authorRepository.findById = jest
      .fn()
      .mockResolvedValue(authorMock);

    const result = await authorService.getAuthorById("123");
    expect(result).toEqual(authorMock);
  });

  it("should throw if author not found by ID", async () => {
    authorService.authorRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(authorService.getAuthorById("not-found")).rejects.toThrow(
      "Author not found"
    );
  });

  it("should create a new author", async () => {
    const data = { name: "Barbara", email: "barbara@mit.edu" };
    authorService.authorRepository.findByEmail = jest
      .fn()
      .mockResolvedValue(null);
    authorService.authorRepository.create = jest.fn().mockResolvedValue(data);

    const result = await authorService.createAuthor(data);
    expect(result).toEqual(data);
  });

  it("should throw if email already exists", async () => {
    const error = new Error("Duplicate key");
    error.code = 11000;

    authorService.authorRepository.findByEmail = jest
      .fn()
      .mockResolvedValue(null);
    authorService.authorRepository.create = jest.fn().mockRejectedValue(error);

    await expect(
      authorService.createAuthor({ email: "existing@email.com" })
    ).rejects.toThrow("Duplicate key");
  });

  it("should update an author", async () => {
    const updated = { name: "Updated", email: "updated@email.com" };
    authorService.authorRepository.update = jest
      .fn()
      .mockResolvedValue(updated);

    const result = await authorService.updateAuthor("abc", { name: "Updated" });
    expect(result).toEqual(updated);
  });

  it("should throw if author not found during update", async () => {
    authorService.authorRepository.update = jest.fn().mockResolvedValue(null);

    await expect(
      authorService.updateAuthor("abc", { name: "Not Found" })
    ).rejects.toThrow("Author not found");
  });

  it("should delete an author", async () => {
    authorService.authorRepository.delete = jest
      .fn()
      .mockResolvedValue({ _id: "123" });

    const result = await authorService.deleteAuthor("123");
    expect(result._id).toBe("123");
  });

  it("should throw if author not found during delete", async () => {
    authorService.authorRepository.delete = jest.fn().mockResolvedValue(null);

    await expect(authorService.deleteAuthor("notfound")).rejects.toThrow(
      "Author not found"
    );
  });

  it("should search authors by name", async () => {
    const authors = [{ name: "Ada" }];
    authorService.authorRepository.searchByName = jest
      .fn()
      .mockResolvedValue(authors);

    const result = await authorService.searchAuthorsByName("Ada");
    expect(result).toEqual(authors);
  });

  it("should throw if name is empty in search", async () => {
    await expect(authorService.searchAuthorsByName("")).rejects.toThrow(
      "Name cannot be empty"
    );
  });
});
