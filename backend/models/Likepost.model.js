class Likepost {
    constructor(type, userId, postId) {
        this.like_post_type = type;
        this.like_post_userId = userId;
        this.like_post_postId = postId;      
    }
};

module.exports = Likepost;