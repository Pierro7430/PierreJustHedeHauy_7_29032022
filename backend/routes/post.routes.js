const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/post.multer-config');

const postCtrl = require('../controllers/post.controllers');

router.post('/post', auth, multer, postCtrl.createPost);
router.get('/post', auth, postCtrl.getAllPosts);
router.get('/mypost/:userId', auth, postCtrl.getMyPost);
router.get('/post/:id', auth, postCtrl.getOnePost);
router.put('/post/:postid', auth, multer, postCtrl.editPost);
router.delete('/post/:postid', auth, postCtrl.deletePost);



module.exports = router;