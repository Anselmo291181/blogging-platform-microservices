import { BaseRepository } from "./baseRepository.js";
import post from "../models/Post.js";

export class PostRepository extends BaseRepository {
  constructor() {
    super(post);
  }

  searchByKeyword = async (keyword) => {
    return await this.model.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
  };
}
