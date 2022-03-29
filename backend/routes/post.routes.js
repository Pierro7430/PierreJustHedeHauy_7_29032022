const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const postCtrl = require('../controllers/post.controllers');

router.post('/', auth, multer, postCtrl.createPost);
router.put('/', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);

router.post('/:id/like', auth, postCtrl.likePost);

router.get('/', auth, postCtrl.gettallpost);
router.get('/:id', auth, postCtrl.getonepost);

module.exports = router;