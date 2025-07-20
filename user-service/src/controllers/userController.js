import { UserService } from "../services/userService.js";
import { UserDto } from "../dtos/userDto.js";
import logger from "../utils/logger.js";

class UserController {
  userService = new UserService();

  register = async (req, res) => {
    try {
      const dto = UserDto.fromRequest(req.body);
      const user = await this.userService.register(dto);
      logger.info("Novo usuário registrado", {
        email: user.email,
        id: user.id,
      });
      res.status(201).json(user);
    } catch (error) {
      logger.error("Erro ao registrar usuário", { error: error.message });
      res.status(400).json({ error: error.message });
    }
  };

  getAllUsers = async (_req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      logger.info("Listagem de todos os usuários");
      res.status(200).json(users);
    } catch (error) {
      logger.error("Erro ao buscar usuários", { error: error.message });
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  };

  getUserById = async (req, res) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      logger.info("Usuário buscado por ID", { id: req.params.id });
      res.status(200).json(user);
    } catch (error) {
      logger.error("Erro ao buscar usuário por ID", {
        id: req.params.id,
        error: error.message,
      });
      res.status(404).json({ error: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const updatedUser = await this.userService.updateUser(
        req.params.id,
        req.body
      );
      logger.info("Usuário atualizado", { id: req.params.id });
      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        author: new UserDto(updatedUser),
      });
    } catch (error) {
      logger.error("Erro ao atualizar usuário", {
        id: req.params.id,
        error: error.message,
      });
      res.status(400).json({ error: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.userService.deleteUser(req.params.id);
      logger.info("Usuário removido", { id: req.params.id });
      res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      logger.error("Erro ao remover usuário", {
        id: req.params.id,
        error: error.message,
      });
      res.status(400).json({ error: error.message });
    }
  };
}

export default UserController;
