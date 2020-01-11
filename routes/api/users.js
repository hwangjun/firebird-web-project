const express = require('express');
const router = express.Router();
const passport = require('passport');
const tokenConfig = require('../../config/token');

/*
 *  /api/users         GET
 *  /api/users/:email  GET       
 *  /api/users/        POST
 */

//전체 회원 조회
router.get('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        const token = tokenConfig.getToken(req.headers);
        if (err) { return next(err); }
        if (token) { return res.json({ success: "true", user, msg: 'User is found.' }); }
        else { res.status(401).send({ success: "false", msg: 'Token is not valid' }) }
    })(req, res, next);
});










module.exports = router;