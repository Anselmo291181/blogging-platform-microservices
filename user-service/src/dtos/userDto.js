export class UserDto {
  constructor(user) {
    this.id = user._id || user.id;
    this.name = user.name;
    this.email = user.email;
    //this.password = user.password;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromRequest(body) {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
    };
  }
}
