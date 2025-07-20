import { AuthorService } from "../services/authorService.js";
import { AuthorDto } from "../dtos/authorDto.js";
import logger from "../utils/logger.js";

class AuthorController {
  constructor() {
    this.authorService = new AuthorService();
  }

  getAllAuthors = async (req, res) => {
    try {
      const authors = await this.authorService.getAllAuthors();
      logger.info("GET /authors - Fetched all authors");
      res.status(200).json(authors.map((author) => new AuthorDto(author)));
    } catch (error) {
      logger.error("GET /authors - Error: " + error.message);
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };

  createAuthor = async (req, res) => {
    try {
      const createdAuthor = await this.authorService.createAuthor(req.body);
      logger.info("POST /authors - Author created");
      res.status(201).json({
        message: "Autor criado com sucesso!",
        author: new AuthorDto(createdAuthor),
      });
    } catch (error) {
      if (error.code === 11000) {
        logger.warn("POST /authors - Email already exists");
        return res.status(400).json({
          error: "email_exists",
          message: "Email já cadastrado",
        });
      }

      logger.error("POST /authors - Error: " + error.message);
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };

  getAuthorById = async (req, res) => {
    try {
      const author = await this.authorService.getAuthorById(req.params.id);
      logger.info(`GET /authors/${req.params.id} - Author found`);
      res.status(200).json(new AuthorDto(author));
    } catch (error) {
      if (error.message === "Author not found") {
        logger.warn(`GET /authors/${req.params.id} - Author not found`);
        return res.status(404).json({
          error: "author_not_found",
          message: "Autor não encontrado",
        });
      }
      logger.error(`GET /authors/${req.params.id} - Error: ${error.message}`);
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };

  updateAuthor = async (req, res) => {
    try {
      const updatedAuthor = await this.authorService.updateAuthor(
        req.params.id,
        req.body
      );
      logger.info(`PUT /authors/${req.params.id} - Author updated`);
      res.status(200).json({
        message: "Author atualizado com sucesso!",
        author: new AuthorDto(updatedAuthor),
      });
    } catch (error) {
      if (error.message === "Author not found") {
        logger.warn(`PUT /authors/${req.params.id} - Author not found`);
        return res.status(404).json({
          error: "author_not_found",
          message: "Autor não encontrado",
        });
      }
      logger.error(`PUT /authors/${req.params.id} - Error: ${error.message}`);
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };

  deleteAuthor = async (req, res) => {
    try {
      await this.authorService.deleteAuthor(req.params.id);
      logger.info(`DELETE /authors/${req.params.id} - Author deleted`);
      res.status(200).json({ message: "Autor removido com sucesso!" });
    } catch (error) {
      if (error.message === "Author not found") {
        logger.warn(`DELETE /authors/${req.params.id} - Author not found`);
        return res.status(404).json({
          error: "author_not_found",
          message: "Autor não encontrado",
        });
      }
      logger.error(
        `DELETE /authors/${req.params.id} - Error: ${error.message}`
      );
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };

  searchAuthorsByName = async (req, res) => {
    try {
      const { name } = req.params;
      const authors = await this.authorService.searchAuthorsByName(name);

      if (authors.length === 0) {
        logger.warn(`GET /authors/search/${name} - No authors found`);
        return res.status(404).json({
          error: "no_authors_found",
          message: "Nenhum autor encontrado com o nome informado!",
          name: name,
        });
      }

      logger.info(
        `GET /authors/search/${name} - Found ${authors.length} authors`
      );
      res.status(200).json(authors.map((author) => new AuthorDto(author)));
    } catch (error) {
      if (error.message === "Name cannot be empty") {
        logger.warn("GET /authors/search - Empty name");
        return res.status(400).json({
          error: "invalid_name",
          message: "Nome não pode ser vazio",
        });
      }
      logger.error("GET /authors/search - Error: " + error.message);
      res.status(500).json({ error: "internal_error", message: error.message });
    }
  };
}

export default AuthorController;
