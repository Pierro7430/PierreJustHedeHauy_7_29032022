class Comment {
    constructor(text, image, creator, postId) {
        this.comment_description = text;
        this.comment_imgUrl = image;
        this.comment_creator = creator;
        this.comment_postId = postId;
        this.comment_updated = 0;
        this.comment_edit_byAdmin = 0;
    }
};

module.exports = Comment;
