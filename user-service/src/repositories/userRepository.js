import { BaseRepository } from "./baseRepository.js";
import { User } from "../models/User.js";

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }
}
