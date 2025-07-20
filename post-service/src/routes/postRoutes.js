import express from "express";
import PostController from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const postController = new PostController();
const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints de gerenciamento de postagens
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todas as postagens
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de postagens retornada com sucesso
 */
routes.get("/", postController.getAllPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria uma nova postagem
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Postagem criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
routes.post("/", authMiddleware, postController.createPost);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Rota de erro se chamada sem palavra-chave
 *     tags: [Posts]
 *     responses:
 *       400:
 *         description: Palavra-chave ausente na URL
 */
routes.get("/search", (req, res) => {
  res.status(400).json({
    error: "keyword_required",
    message: "Por favor, informe uma palavra-chave após /search/",
    example: "GET /posts/search/javascript",
  });
});

/**
 * @swagger
 * /posts/search/{keyword}:
 *   get:
 *     summary: Busca postagens por palavra-chave
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Palavra-chave para buscar nas postagens
 *     responses:
 *       200:
 *         description: Postagens encontradas
 *       404:
 *         description: Nenhuma postagem encontrada
 */
routes.get("/search/:keyword", postController.findPostsByKeyword);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retorna uma postagem por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     responses:
 *       200:
 *         description: Postagem encontrada
 *       404:
 *         description: Postagem não encontrada
 */
routes.get("/:id", postController.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza uma postagem existente
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Postagem atualizada com sucesso
 *       404:
 *         description: Postagem não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.put("/:id", authMiddleware, postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Remove uma postagem
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da postagem
 *     responses:
 *       204:
 *         description: Postagem removida com sucesso
 *       404:
 *         description: Postagem não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.delete("/:id", authMiddleware, postController.deletePost);

export default routes;
