const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const likeCtrl = require('../controllers/like.controllers');

router.get('/like/post/:id', auth, likeCtrl.getMyLikesPost);
router.post('/like/post', auth, likeCtrl.postLikePost);

router.get('/like/comment/:id', auth, likeCtrl.getMyLikesComment);
router.post('/like/comment', auth, likeCtrl.postLikeComment);

module.exports = router;