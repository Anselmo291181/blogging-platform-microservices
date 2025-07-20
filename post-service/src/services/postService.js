import { PostRepository } from "../repositories/postRepository.js";
import { PostDto } from "../dtos/postDto.js";
import fetch from "node-fetch";
import logger from "../utils/logger.js";

export class PostService {
  postRepository = new PostRepository();

  async isAuthorValid(authorId) {
    try {
      const baseUrl =
        process.env.USER_SERVICE_URL || "http://user-service:3001";
      const response = await fetch(`${baseUrl}/authors/${authorId}`);
      if (!response.ok) {
        logger.warn("Autor inválido", { authorId });
      }
      return response.ok;
    } catch (error) {
      logger.error("Erro ao verificar autor", {
        authorId,
        error: error.message,
      });
      return false;
    }
  }

  getAllPosts = async () => {
    logger.info("Buscando todos os posts");
    return await this.postRepository.findAll();
  };

  createPost = async (postData) => {
    const isValid = await this.isAuthorValid(postData.author);
    if (!isValid) {
      logger.warn("Tentativa de criar post com autor inválido", {
        authorId: postData.author,
      });
      throw new Error("Author not found");
    }

    const completePost = {
      ...PostDto.fromRequest(postData),
      author: postData.author,
    };

    const created = await this.postRepository.create(completePost);
    logger.info("Post criado com sucesso", { id: created._id });
    return created;
  };

  getPostById = async (id) => {
    const post = await this.postRepository.findById(id);
    if (!post) {
      logger.warn("Post não encontrado", { id });
      throw new Error("Post not found");
    }
    logger.info("Post encontrado por ID", { id });
    return post;
  };

  updatePost = async (id, postData) => {
    if (postData.author) {
      const isValid = await this.isAuthorValid(postData.author);
      if (!isValid) {
        logger.warn("Tentativa de atualizar post com autor inválido", {
          id,
          authorId: postData.author,
        });
        throw new Error("Author not found");
      }
    }

    const updatedPost = await this.postRepository.update(id, postData);
    if (!updatedPost) {
      logger.warn("Post para atualização não encontrado", { id });
      throw new Error("Post not found");
    }

    logger.info("Post atualizado com sucesso", { id });
    return updatedPost;
  };

  deletePost = async (id) => {
    const deletedPost = await this.postRepository.delete(id);
    if (!deletedPost) {
      logger.warn("Post para exclusão não encontrado", { id });
      throw new Error("Post not found");
    }

    logger.info("Post removido com sucesso", { id });
    return deletedPost;
  };

  searchPostsByKeyword = async (keyword) => {
    if (!keyword || keyword.trim() === "") {
      logger.warn("Busca de post com palavra-chave vazia");
      throw new Error("Keyword cannot be empty");
    }

    logger.info("Buscando posts por palavra-chave", { keyword });
    return await this.postRepository.searchByKeyword(keyword);
  };
}
