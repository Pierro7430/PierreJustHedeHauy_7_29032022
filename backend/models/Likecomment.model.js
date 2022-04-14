class Likecomment {
    constructor(type, userId, postId) {
        this.like_comment_type = type;
        this.like_comment_userId = userId;
        this.like_comment_commentId = postId;      
    }
};

module.exports = Likecomment;