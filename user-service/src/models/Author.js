import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do autor é obrigatório"],
    },
    email: {
      type: String,
      required: [true, "O email do autor é obrigatório"],
      unique: true,
      index: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const author = mongoose.model("authors", authorSchema);

export { author, authorSchema };
