import { PostService } from "../services/postService.js";
import { PostDto } from "../dtos/postDto.js";
import logger from "../utils/logger.js";

class PostController {
  postService = new PostService();

  getAllPosts = async (req, res) => {
    try {
      const posts = await this.postService.getAllPosts();
      logger.info("Listagem de todos os posts");
      res.status(200).json(posts);
    } catch (error) {
      logger.error("Erro ao buscar posts", { error: error.message });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };

  createPost = async (req, res) => {
    try {
      const createdPost = await this.postService.createPost(req.body);
      logger.info("Novo post criado", { id: createdPost._id });
      res.status(201).json({
        message: "Post criado com sucesso!",
        post: new PostDto(createdPost),
      });
    } catch (error) {
      if (error.message === "Author not found") {
        logger.warn("Tentativa de criar post com autor inexistente", {
          authorId: req.body.authorId,
        });
        return res.status(404).json({
          error: "author_not_found",
          message: "Autor não encontrado",
        });
      }
      logger.error("Erro ao criar post", { error: error.message });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };

  getPostById = async (req, res) => {
    try {
      const post = await this.postService.getPostById(req.params.id);
      logger.info("Post buscado por ID", { id: req.params.id });
      res.status(200).json(new PostDto(post));
    } catch (error) {
      if (error.message === "Post not found") {
        logger.warn("Post não encontrado", { id: req.params.id });
        return res.status(404).json({
          error: "post_not_found",
          message: "Post não encontrado",
        });
      }
      logger.error("Erro ao buscar post", {
        id: req.params.id,
        error: error.message,
      });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };

  updatePost = async (req, res) => {
    try {
      const updatedPost = await this.postService.updatePost(
        req.params.id,
        req.body
      );
      logger.info("Post atualizado", { id: req.params.id });
      res.status(200).json({
        message: "Post atualizado com sucesso!",
        post: new PostDto(updatedPost),
      });
    } catch (error) {
      if (error.message === "Post not found") {
        logger.warn("Tentativa de atualizar post inexistente", {
          id: req.params.id,
        });
        return res.status(404).json({
          error: "post_not_found",
          message: "Post não encontrado",
        });
      }
      logger.error("Erro ao atualizar post", {
        id: req.params.id,
        error: error.message,
      });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };

  deletePost = async (req, res) => {
    try {
      await this.postService.deletePost(req.params.id);
      logger.info("Post removido", { id: req.params.id });
      res.status(200).json({ message: "Post removido com sucesso!" });
    } catch (error) {
      if (error.message === "Post not found") {
        logger.warn("Tentativa de remover post inexistente", {
          id: req.params.id,
        });
        return res.status(404).json({
          error: "post_not_found",
          message: "Post não encontrado",
        });
      }
      logger.error("Erro ao remover post", {
        id: req.params.id,
        error: error.message,
      });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };

  findPostsByKeyword = async (req, res) => {
    try {
      const { keyword } = req.params;
      const posts = await this.postService.searchPostsByKeyword(keyword);

      if (posts.length === 0) {
        logger.info("Nenhum post encontrado com a palavra-chave", { keyword });
        return res.status(404).json({
          error: "no_posts_found",
          message: "Nenhum post encontrado com a palavra-chave informada!",
          keyword,
        });
      }

      logger.info("Posts encontrados por palavra-chave", { keyword });
      res.status(200).json(posts.map((post) => new PostDto(post)));
    } catch (error) {
      if (error.message === "Keyword cannot be empty") {
        logger.warn("Palavra-chave vazia na busca por posts");
        return res.status(400).json({
          error: "invalid_keyword",
          message: "Palavra-chave não pode ser vazia",
          example: "GET /posts/search/react",
        });
      }
      logger.error("Erro ao buscar posts por palavra-chave", {
        keyword: req.params.keyword,
        error: error.message,
      });
      res.status(500).json({
        error: "internal_error",
        message: error.message,
      });
    }
  };
}

export default PostController;
