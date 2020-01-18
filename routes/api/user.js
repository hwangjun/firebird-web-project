const router = require('express').Router();
const tokenConfig = require('../../config/token');
const User = require('../../models/user/User');
const authMiddleWare = require('../../config/authMiddleware');

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
 * /api/users:
 *   get:
 *     summary: 모든 회원 조회
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', authMiddleWare.isLoggedin, (req, res) => {
    User.findAll().then((user) => {
        if (!user.length) return res.status(404).json({ err: 'User not found' });
        res.json(user);
    }).catch(err => res.status(500).json(err));
});

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: 특정 회원 조회
 *     tags: [User]
 *     consumes:
 *       - application/json 
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *         description: 이메일
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/:email', authMiddleWare.isLoggedin, (req, res) => {
    User.findByUserEamil(req.params.email).then((user) => {
        if (!user) return res.status(404).json({ err: 'User not found' });
        res.json(user);
    })
        .catch(err => res.status(500).json(err));
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
*        - name: body
*          in: body
*          required: true
*          schema:
*            type: object
*            required: [email, password, passwordConfirmation, name]
*            properties:
*              email:
*                type: string
*                format: email
*                description: 이메일
*              password:
*                type: string
*                format: password
*                description: 비밀번호
*              passwordConfirmation:
*                type: string
*                format: password
*                description: 비밀번호확인
*              name:
*                type: string
*                description: 이름
*      responses:
*        200:
*          description: OK
*/
router.post('/', authMiddleWare.isLoggedin, (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
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
*        - name: body
*          in: body
*          required: true
*          schema:
*            type: object
*            required: [email, password, name]
*            properties:
*              email:
*                type: string
*                format: email
*                description: 이메일
*              password:
*                type: string
*                format: password
*                description: 비밀번호
*              name:
*                type: string
*                description: 이름
*      responses:
*        200:
*          description: OK
*/
router.patch('/', authMiddleWare.isLoggedin, authMiddleWare.checkPermission, (req, res) => {
    User.update(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
});

/**
*    @swagger
*    /api/users/{email}:
*    delete:
*      summary: 회원 제거
*      tags: [User]
*      consumes:
*        - application/json
*      parameters:
*        - name: body
*          in: body
*          required: true
*          schema:
*            type: object
*            required: [email]
*            properties:
*              email:
*                 type: string
*                 format: email
*                 description: 이메일
*      responses:
*        200:
*          description: OK
*/
router.delete('/:email', authMiddleWare.isLoggedin, authMiddleWare.checkPermission, (req, res) => {
    User.delete(req.body.email)
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));
});

module.exports = router;