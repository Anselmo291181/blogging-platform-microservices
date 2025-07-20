export class PostDto {
    constructor(post) {
      this.id = post._id || post.id;
      this.title = post.title;
      this.description = post.description;
      this.author = post.author;
      this.createdAt = post.createdAt;
      this.updatedAt = post.updatedAt;
    }
  
    static fromRequest(body) {
      return {
        title: body.title,
        description: body.description,
        author: body.author,
      };
    }
  }