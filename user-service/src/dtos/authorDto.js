export class AuthorDto {
  constructor(author) {
    this.id = author._id || author.id;
    this.name = author.name;
    this.email = author.email;
    this.createdAt = author.createdAt;
    this.updatedAt = author.updatedAt;
  }

  static fromRequest(body) {
    return {
      name: body.name,
      email: body.email,
    };
  }
}
