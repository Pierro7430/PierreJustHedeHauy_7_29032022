const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/post.multer-config');

const commentCtrl = require('../controllers/comment.controllers');

router.post('/comment/', auth, multer, commentCtrl.createComment);
router.get('/comment/:postId', auth, commentCtrl.getAllComments);
router.get('/all-counts-comment', auth, commentCtrl.allCountsComment);
router.get('/one-count-comment/:postId', auth, commentCtrl.countComment);
router.get('/mycomment/:userId', auth, commentCtrl.myComment);
router.put('/comment/:commentId', auth, multer, commentCtrl.editComment);
router.delete('/comment/:commentId', auth, commentCtrl.deleteComment);


module.exports = router;