import express from "express";
import AuthController from "../controllers/authController.js";

const routes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para login e autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT de acesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno no servidor
 */
routes.post("/login", AuthController.login);

export default routes;
