import { BaseRepository } from "./baseRepository.js";
import { author } from "../models/Author.js";

export class AuthorRepository extends BaseRepository {
  constructor() {
    super(author);
  }

  async searchByName(name) {
    return await this.model.find({
      name: { $regex: name, $options: "i" },
    });
  }
}
