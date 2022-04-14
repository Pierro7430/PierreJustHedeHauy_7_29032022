const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/user.multer-config');

const userCtrl = require('../controllers/user.controllers');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.profile);
router.put('/profile/:id', auth, multer, userCtrl.editProfile);
router.delete('/profile/:id', auth, userCtrl.deleteAccount);


router.get('/admin/:id', auth, userCtrl.isAdmin);
router.get('/admin/users/:id', auth, userCtrl.allUsers);
// router.delete('/admin/user/:id', auth, userCtrl.adminDeleteAccount);



module.exports = router;