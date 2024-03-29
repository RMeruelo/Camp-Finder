const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegisterPage )
    .post(catchAsync(users.registerNewUser))


router.route('/login')
    .get(users.renderLoginPage)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}),users.loginUser)


router.get('/logout', users.userLogout)

module.exports = router;