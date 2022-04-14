class Post {
    constructor(title, text, image, creator) {
        this.post_title = title;
        this.post_description = text;
        this.post_imgUrl = image;
        this.post_creator = creator;
        this.post_updated = 0;
        this.post_edit_byAdmin = 0;
    }
};

module.exports = Post;
