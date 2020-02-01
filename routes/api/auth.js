// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const authMiddleware = require('../../config/authMiddleware');
// const util = require('../../common/util');


import express from "express";
const router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";
import {isLoggedin} from '../../config/authMiddleware';

import util from "../../common/util";

 /**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인.
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required: [email, password]
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: Email
 *             password:
 *               type: string
 *               format: password
 *               description: password
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
    passport.authenticate('local-signin', (err, user) => {
        // if (err) { return next(err); }
        // if (!user) { return res.json({ success: "false", msg: 'User not found or Wrong password.' }); }
        if (err || !user) return res.json(util.successFalse(err, 'User not found or Wrong password.'));
        req.logIn(user, (err) => {
            if (err) return  res.json(util.successFalse(err, 'Login failed'));
            const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, {
                expiresIn: 60*60*24 //604800  1 week
            },(err, token) => {
                if(err) return res.json(util.successFalse(err));
                const data = util.successTrue(user,'Login Success.');
                data.token = token;
                return res.json(data);
            });
            //return res.json({ success: "true", user, token: 'JWT ' + token, msg: 'Login Success.' });
        });
    })(req, res, next);
});

 /**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입.
 *     tags: [Auth]
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required: [email, password, passwordConfirmation, name]
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: 이메일
 *             password:
 *               type: string
 *               format: password
 *               description: 비밀번호
 *             passwordConfirmation:
 *               type: string
 *               format: password
 *               description: 비밀번호확인
 *             name:
 *               type: string
 *               description: 이름 
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
router.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user) => {
        // if (err) { return next(err); }
        // if (user) { //newUser 반환
        //     return res.json({ success: "true", user, msg: 'User register Success.' });
        // } else { //false 반환
        //     return res.json({ success: "false", "email": req.body.email, msg: 'User is found.' });
        // })
        if (err) return res.json(util.successFalse(err));
        if (!user) { return res.json(util.successFalse(err, 'User is found.')) }
        else { return res.json(util.successTrue(user, 'User register Success.')) };
    })(req, res, next);
});


router.use('/check', isLoggedin);
 /**
 * @swagger
 * /api/auth/check:
 *   get:
 *     summary: jwt 유효한지 확인
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         type: string
 *         description: jwt toekn 
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
router.get('/check', (req, res) => {
    res.json({ success: "true", info: req.decoded });
});

// module.exports = router;
export default router;