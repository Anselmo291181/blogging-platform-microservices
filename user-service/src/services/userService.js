import bcryptjs from "bcryptjs";
import { UserDto } from "../dtos/userDto.js";
import { UserRepository } from "../repositories/userRepository.js";
import logger from "../utils/logger.js";

const { hash } = bcryptjs;

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  register = async (userData) => {
    const userExists = await this.userRepository.findByEmail(userData.email);

    if (userExists) {
      logger.warn("Tentativa de registro com e-mail já cadastrado", {
        email: userData.email,
      });
      throw new Error("Usuário já cadastrado!");
    }

    const passwordHash = await hash(userData.password, 8);
    const userToCreate = {
      name: userData.name,
      email: userData.email,
      password: passwordHash,
    };

    const createdUser = await this.userRepository.create(userToCreate);
    logger.info("Usuário criado com sucesso", {
      email: createdUser.email,
      id: createdUser.id,
    });

    return new UserDto(createdUser);
  };

  getAllUsers = async () => {
    const users = await this.userRepository.findAll();
    logger.info("Consulta de todos os usuários");
    return users.map((user) => new UserDto(user));
  };

  getUserById = async (id) => {
    const user = await this.userRepository.findById(id);
    if (!user) {
      logger.warn("Usuário não encontrado ao buscar por ID", { id });
      throw new Error("Usuário não encontrado!");
    }
    logger.info("Usuário encontrado por ID", { id });
    return new UserDto(user);
  };

  updateUser = async (id, userData) => {
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      logger.warn("Tentativa de atualização de usuário inexistente", { id });
      throw new Error("Usuário não encontrado!");
    }
    logger.info("Usuário atualizado com sucesso", { id });
    return new UserDto(updatedUser);
  };

  deleteUser = async (id) => {
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser) {
      logger.warn("Tentativa de exclusão de usuário inexistente", { id });
      throw new Error("Usuário não encontrado!");
    }
    logger.info("Usuário excluído com sucesso", { id });
    return deletedUser;
  };
}
