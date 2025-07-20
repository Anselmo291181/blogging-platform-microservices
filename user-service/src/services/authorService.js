import { AuthorRepository } from "../repositories/authorRepository.js";
import { AuthorDto } from "../dtos/authorDto.js";
import logger from "../utils/logger.js";

export class AuthorService {
  constructor() {
    this.authorRepository = new AuthorRepository();
  }

  getAllAuthors = async () => {
    const authors = await this.authorRepository.findAll();
    logger.info(`AuthorService - Retrieved ${authors.length} authors`);
    return authors;
  };

  createAuthor = async (authorData) => {
    const authorToCreate = AuthorDto.fromRequest(authorData);
    const created = await this.authorRepository.create(authorToCreate);
    logger.info("AuthorService - Author created");
    return created;
  };

  getAuthorById = async (id) => {
    const foundAuthor = await this.authorRepository.findById(id);
    if (!foundAuthor) {
      logger.warn(`AuthorService - Author not found (id: ${id})`);
      throw new Error("Author not found");
    }
    logger.info(`AuthorService - Author found (id: ${id})`);
    return foundAuthor;
  };

  updateAuthor = async (id, authorData) => {
    const updatedAuthor = await this.authorRepository.update(id, authorData);
    if (!updatedAuthor) {
      logger.warn(`AuthorService - Failed to update (not found, id: ${id})`);
      throw new Error("Author not found");
    }
    logger.info(`AuthorService - Author updated (id: ${id})`);
    return updatedAuthor;
  };

  deleteAuthor = async (id) => {
    const deletedAuthor = await this.authorRepository.delete(id);
    if (!deletedAuthor) {
      logger.warn(`AuthorService - Failed to delete (not found, id: ${id})`);
      throw new Error("Author not found");
    }
    logger.info(`AuthorService - Author deleted (id: ${id})`);
    return deletedAuthor;
  };

  searchAuthorsByName = async (name) => {
    if (!name || name.trim() === "") {
      logger.warn("AuthorService - Empty name provided in search");
      throw new Error("Name cannot be empty");
    }
    const results = await this.authorRepository.searchByName(name);
    logger.info(
      `AuthorService - Found ${results.length} author(s) matching name: "${name}"`
    );
    return results;
  };
}
