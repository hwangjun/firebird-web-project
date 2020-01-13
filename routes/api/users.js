const router = require('express').Router();
const tokenConfig = require('../../config/token');
const User = require('../../models/user/User');
const authMiddleWare = require('../../config/authMiddleware');

/*
 *  /api/users         GET
 *  /api/users/:email  GET       
 *  /api/users/        POST
 */

//전체 회원 조회
// router.get('/', (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user) => {
//         const token = tokenConfig.getToken(req.headers);
//         if (err) { return next(err); }
//         if (token) { return res.json({ success: "true", user, msg: 'User is found.' }); }
//         else { res.status(401).send({ success: "false", msg: 'Token is not valid' }) }
//     })(req, res, next);
// });



/*
options
    enum: [cjung, gglee, etc..]


responses
    200:
        description: 성공
    403:
        $ref: '#/components/res/Forbidden'
    404:
        $ref: '#/components/res/NotFound'
    500:
        $ref: '#/components/res/BadRequest'

*/

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: 모든 회원 조회
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', (req, res)=> {
    console.log('USER : ', User);
    User.findAll().then((user) => {
        console.log('dafasdf');
        if (!user.length) return res.status(404).send({ err: 'User not found' });
        res.send(user);
    })
        .catch(err => res.status(500).send(err));
    // User.findAll().then((user) => {
    //     console.log('dafasdf');
    //     if (!user.length) return res.status(404).send({ err: 'User not found' });
    //     res.send(user);
    // })
    //     .catch(err => res.status(500).send(err));
    //res.json({ success: "true", info: req.decoded });
});

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: 특정 회원 조회
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *         description: |
 *          이메일
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/:email', authMiddleWare, (req, res) => {
    User.findByCategoryCode(req.params.email).then((user) => {
        if (!user) return res.status(404).send({ err: 'User not found' });
        res.send(user);
    })
        .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/users:
*    post:
*      summary: 회원 생성
*      tags: [User]
*      consumes:
*        - application/json
*      parameters:
*        - in: formData
*          name: email
*          type: string
*          description: 이메일
*        - in: formData
*          name: password
*          type: string
*          description: 비밀번호
*        - in: formData
*          name: name
*          type: string
*          description: 이름
*      responses:
*        200:
*          description: OK
*/
router.post('/', authMiddleWare, (req, res) => {
    User.create(req.body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});


/**
*    @swagger
*    /api/users:
*    patch:
*      summary: 회원 수정
*      tags: [User]
*      consumes:
*        - application/json
*      parameters:
*        - in: formData
*          name: email
*          type: string
*          description: 이메일
*        - in: formData
*          name: password
*          type: string
*          description: 비밀번호
*        - in: formData
*          name: name
*          type: string
*          description: 이름
*      responses:
*        200:
*          description: OK
*/
router.patch('/', authMiddleWare, (req, res) => {
    User.update(req.body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/users:
*    delete:
*      summary: 회원 제거
*      tags: [User]
*      consumes:
*        - application/json
*      parameters:
*        - in: formData
*          name: email
*          type: string
*          description: 이메일
*      responses:
*        200:
*          description: OK
*/
router.delete('/', authMiddleWare, (req, res) => {
    User.delete(req.body.email)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});

module.exports = router;