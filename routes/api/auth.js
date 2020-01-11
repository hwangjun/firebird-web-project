const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/*
 *  /api/auth/login    post - email, password 
 *  /api/auth/register post - email, password, name
 */


 /**
 * @swagger
 * /message:
 *   post:
 *     summary: 사용자 요청별 메시지별 응답.
 *     tags: [Auth]
 *     parameters:
 *       - in: param
 *         email: string
 *         password: string
 *     responses:
 *       200:
 *         description: 성공
 *       403:
 *         $ref: '#/components/res/Forbidden'
 *       404:
 *         $ref: '#/components/res/NotFound'
 *       500:
 *         $ref: '#/components/res/BadRequest'
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local-signin', (err, user, info) => {
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
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) { return next(err); }
        if (user) { //newUser 반환
            return res.json({ success: "true", user, msg: 'User register Success.' });
        } else { //false 반환
            return res.json({ success: "false", "email": req.body.email, msg: 'User is found.' });
        }
    })(req, res, next);
});

module.exports = router;