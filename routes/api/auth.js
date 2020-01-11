const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../../config/authMiddleware');

/*
 *  /api/auth/login    POST - email, password 
 *  /api/auth/register POST - email, password, name
 *  /api/auth/check    GET  - token or header authorization(token)
 */

//로그인
router.post('/login', (req, res, next) => {
    passport.authenticate('local-signin', (err, user) => {
        if (err) { return next(err); }
        if (!user) { return res.json({ success: "false", msg: 'User not found or Wrong password.' }); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 604800 // 1 week
            });
            return res.json({ success: "true", user, token: 'JWT ' + token, msg: 'Login Success.' });
        });
    })(req, res, next);
});

//회원가입
router.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user) => {
        if (err) { return next(err); }
        if (user) { //newUser 반환
            return res.json({ success: "true", user, msg: 'User register Success.' });
        } else { //false 반환
            return res.json({ success: "false", "email": req.body.email, msg: 'User is found.' });
        }
    })(req, res, next);
});

//JWT 검증을 통한 현재 계정상태 확인
router.use('/check', authMiddleware);
router.get('/check', (req, res) => {
    res.json({ success: "true", info: req.decoded });
});

module.exports = router;