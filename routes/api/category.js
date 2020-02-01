// const router = require('express').Router();
// const Category = require('../../models/product/Category');
import express from "express";
const router = express.Router();
import Category from "../../models/product/Category";
import {isLoggedin, checkAdminPermission} from "../../config/authMiddleware";

/**
 * @swagger
 * /api/categorys:
 *   get:
 *     summary: 모든 카테고리 조회
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', (req, res) => {
    Category.findAll().then((category) => {
        if (!category.length) return res.status(404).send({ err: 'Category not found' });
        // res.send(`find successfully: ${category}`);
        res.send(category);
    })
    .catch(err => res.status(500).send(err));
});

/**
 * @swagger
 * /api/categorys/{categoryCode}:
 *   get:
 *     summary: 특정 카테고리 조회
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryCode
 *         type: string
 *         required: true
 *         description: |
 *          카테고리 코드
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/:categoryCode', isLoggedin , checkAdminPermission, (req, res) => {
    Category.findByCategoryCode(req.params.categoryCode).then((category) => {
      if (!category) return res.status(404).send({ err: 'Category not found' });
        // res.send(`findByCategoryCode successfully: ${category}`);
        res.send(category);
    })
    .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/categorys:
*    post:
*      summary: 카테고리 생성
*      tags: [Category]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: categoryCode
*          type: string
*          description: 카테고리 코드
*        - in: formData
*          name: parentCategoryCode
*          type: string
*          description: 부모 카테고리 코드
*        - in: formData
*          name: categoryName
*          type: string
*          description: 카레고리명
*        - in: formData
*          name: depth
*          type: string
*          description: 깊이
*      responses:
*        200:
*          description: OK
*/
router.post('/', isLoggedin , checkAdminPermission, (req, res) => {
    Category.create(req.body)
        .then(category => res.send(category))
        .catch(err => res.status(500).send(err));
});


/**
*    @swagger
*    /api/categorys:
*    patch:
*      summary: 카테고리 수정
*      tags: [Category]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: categoryCode
*          type: string
*          description: 카테고리 코드
*        - in: formData
*          name: parentCategoryCode
*          type: string
*          description: 부모 카테고리 코드
*        - in: formData
*          name: categoryName
*          type: string
*          description: 카레고리명
*        - in: formData
*          name: depth
*          type: string
*          description: 깊이
*      responses:
*        200:
*          description: OK
*/
router.patch('/', isLoggedin , checkAdminPermission, (req, res) => {
    Category.update(req.body)
        .then(category => res.send(category))
        .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/categorys:
*    delete:
*      summary: 카테고리 제거
*      tags: [Category]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: categoryCode
*          type: string
*          description: 카테고리 코드
*      responses:
*        200:
*          description: OK
*/
router.delete('/', isLoggedin , checkAdminPermission, (req, res) => {
    Category.delete(req.body.categoryCode)
        .then(category => res.send(category))
        .catch(err => res.status(500).send(err));
});

// module.exports = router;
export default router;