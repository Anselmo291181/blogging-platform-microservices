import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import jsonSecret from "../config/jsonSecret.js";
import logger from "../utils/logger.js";

class AuthService {
  async login(dto) {
    try {
      const user = await User.findOne({
        email: dto.email,
      }).select("id email password");

      if (!user) {
        logger.warn("Tentativa de login com email não cadastrado", {
          email: dto.email,
        });
        throw new Error("Usuário não cadastrado!");
      }

      const passwordsMatch = await bcryptjs.compare(
        dto.password,
        user.password
      );

      if (!passwordsMatch) {
        logger.warn("Senha incorreta na tentativa de login", {
          email: dto.email,
        });
        throw new Error("Usuário ou senha inválido!");
      }

      const acessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        jsonSecret.secret,
        {
          expiresIn: 86400,
        }
      );

      logger.info("Login bem-sucedido", { userId: user.id, email: user.email });

      return { acessToken };
    } catch (error) {
      logger.error("Erro ao processar login", {
        email: dto.email,
        message: error.message,
      });
      throw new Error(error.message);
    }
  }
}

export default AuthService;
