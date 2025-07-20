import "dotenv/config";
import app from "./src/app.js";
import connectToDatabase from "./src/config/dbConnect.js";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    const connection = await connectToDatabase();

    connection.on("error", (error) => {
      console.error("Erro de conexão", error);
    });

    connection.once("open", () => {
      console.log("Conexão com o banco realizada com sucesso!");
    });

    app.listen(PORT, () => {
      console.log(`User service rodando em http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
};

startServer();
