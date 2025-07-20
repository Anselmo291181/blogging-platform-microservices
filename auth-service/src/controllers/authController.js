import AuthService from "../services/authService.js";
import logger from "../utils/logger.js";

const authService = new AuthService();

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const login = await authService.login({ email, password });

      logger.info("Login realizado com sucesso", { email });

      res.status(200).send(login);
    } catch (error) {
      logger.error("Erro ao tentar login", { email, message: error.message });

      res.status(401).send({ message: error.message });
    }
  }
}

export default AuthController;
