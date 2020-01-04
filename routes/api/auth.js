const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


/*
 *  /api/auth/login    post - email, password 
 *  /api/auth/register post - email, password, name
 */

//로그인
router.post('/login', passport.authenticate('local-signin', { session: false }), (req, res) => {
    const user = req.user;
    if (user) {
        const token = jwt.sign(req.user.toJSON(), 'jwt-secret', {
            expiresIn: 604800 // 1 week
        });
        res.json({ success: true, user, token: 'JWT ' + token , msg : 'Login Success.'});
    } else {
        res.json({ success: false, msg: 'User not found or Wrong password.' });
    }
});

//회원가입
router.post('/register', passport.authenticate('local-signup', { session: false }), (req, res) => {
    const user = req.user;
    if (user) {
        res.json({ success: true, user, msg : 'Rigister Success.'});
    } else {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    }
});

module.exports = router;