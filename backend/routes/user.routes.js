const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const userCtrl = require('../controllers/user.controllers');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', auth, userCtrl.profile);

module.exports = router;