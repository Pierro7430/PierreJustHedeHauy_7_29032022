const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const userCtrl = require('../controllers/user.controllers');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.profile);
router.put('/profile/:id', auth, multer, userCtrl.editProfile);
router.put('/profile/img/:id', auth, userCtrl.removeImg);
router.delete('/profile/:id', auth, userCtrl.deleteAccount);

module.exports = router;