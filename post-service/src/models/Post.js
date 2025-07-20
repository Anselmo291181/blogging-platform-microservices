import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título é obrigatório"],
    },
    description: {
      type: String,
    },
    author: {
      type: String, // mongoose.Schema.Types.ObjectId -- ID do autor vindo do user-service
      required: [true, "O autor é obrigatório"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const post = mongoose.model("posts", postSchema);

export default post;
