import mongoose from "mongoose";

let isConnected = false;

export async function connectTestDatabase() {
  const dbUrl = process.env.DB_URL_TEST || process.env.DB_CONNECTION_STRING;

  if (!dbUrl) {
    console.error("DB_URL_TEST não está definida. Verifique seu .env.test");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl);
    isConnected = true;
    // console.log("Conectado ao MongoDB de teste");
  } catch (error) {
    console.error("Falha ao conectar no MongoDB de teste:", error);
    process.exit(1);
  }
}

export async function cleanTestCollection(collectionName) {
  if (isConnected) {
    await mongoose.connection.db.collection(collectionName).deleteMany({});
  }
}

export async function disconnectTestDatabase() {
  if (isConnected && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    // console.log("Banco de teste limpo e desconectado");
  }
}
