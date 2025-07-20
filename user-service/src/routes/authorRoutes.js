import express from "express";
import AuthorController from "../controllers/authorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authorController = new AuthorController();
const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autores
 *   description: Endpoints para gerenciamento de autores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do autor
 *         name:
 *           type: string
 *           description: Nome do autor
 *         email:
 *           type: string
 *           description: Email do autor
 *       required:
 *         - id
 *         - name
 *         - email
 *     AuthorInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do autor
 *         email:
 *           type: string
 *           description: Email do autor
 *       required:
 *         - name
 *         - email
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Lista todos os autores
 *     tags: [Autores]
 *     responses:
 *       200:
 *         description: Lista de autores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
routes.get("/", authorController.getAllAuthors);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Cria um novo autor
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Autor criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
routes.post("/", authMiddleware, authorController.createAuthor);

/**
 * @swagger
 * /authors/search/{name}:
 *   get:
 *     summary: Busca autores pelo nome
 *     tags: [Autores]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do autor
 *     responses:
 *       200:
 *         description: Lista de autores encontrados
 */
routes.get("/search/:name", authorController.searchAuthorsByName);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Busca um autor pelo ID
 *     tags: [Autores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do autor
 *     responses:
 *       200:
 *         description: Autor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Autor não encontrado
 */
routes.get("/:id", authorController.getAuthorById);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Atualiza um autor pelo ID
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       200:
 *         description: Autor atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Autor não encontrado
 */
routes.put("/:id", authMiddleware, authorController.updateAuthor);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Remove um autor pelo ID
 *     tags: [Autores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do autor
 *     responses:
 *       204:
 *         description: Autor removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Autor não encontrado
 */
routes.delete("/:id", authMiddleware, authorController.deleteAuthor);

export default routes;
