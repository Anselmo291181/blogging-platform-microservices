import mongoose from "mongoose";

export const connectTestDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const disconnectTestDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const cleanTestCollection = async (collectionName) => {
  await mongoose.connection.collection(collectionName).deleteMany({});
};
