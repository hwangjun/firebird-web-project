// const express = require('express');
// const router = express.Router();
// const {check, validationResult} = require('express-validator');
// const Prod = require('../../models/product/Product');

import express from "express";
const router = express.Router();
import expressValidator from "express-validator";
const check = expressValidator.check;
const validationResult  = expressValidator.validationResult ;
import Prod from "../../models/product/Product";

/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: 모든 상품 조회
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', (req, res) => {
    let responseResult = {
        state: 200,
        desc: '',
        result: null
    }

    let prod_n = req.query.prod_n != null ? req.query.prod_n.trim() : null;
    let skip = req.query.offset != null ? Number(req.query.offset) : 0;
    let limit = req.query.limit != null ? Number(req.query.limit) : 10;
    
    let query = {};
    if (null != prod_n && '' != prod_n) {
        query.prod_n = prod_n
    }

    Prod.findAll(query, skip, limit)
        .then((r) => {
            responseResult.result = r;
        })
        .catch((err) => {
            responseResult.state = 500;
            responseResult.desc = 'productList Search FAIL';
        })
        .then(()=>{
            res.status(responseResult.state).json(responseResult);
        });
});

/**
 * @swagger
 * /api/products/{prod_c}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: prod_c
 *         type: integer
 *         required: true
 *         description: 상품코드
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/:prod_c', check('prod_c').isNumeric(),(req, res) => {
    let responseResult = {
        state: 200,
        desc: '',
        result: null
    }

    const validationError = validationResult(req);
    // 유효성 검사 통과 못할 경우 false
    if (false == validationError.isEmpty()) {
        responseResult.state = 400;
        responseResult.desc = validationError.errors[0].msg + '[' + validationError.errors[0].param + ']';
    }
    if (400 != responseResult.state) {
        Prod.findByProductCode(req.params.prod_c)
            .then((result) => {
                responseResult.result = result;
            })
            .catch((err) => {
                responseResult.result = err;
                responseResult.state = 500;
            })
            .then(()=>{
                res.status(responseResult.state).json(responseResult);
            });
    }
});

/**
*    @swagger
*    /api/products:
*    post:
*      summary: 상품 생성
*      tags: [Product]
*      consumes:
*        - application/json
*      parameters:
*        - in: formData
*          name: prod_c
*          type: integer
*          description: 상품코드
*        - in: formData
*          name: prod_n
*          type: string
*          description: 상품명
*      responses:
*        200:
*          description: OK
*/
router.post('/', [check('prod_c').isInt(), check('prod_n').isString()]
            , (req, res, next) => {
    let responseResult = {
        state: 200,
        desc: '',
        result: null
    }

    const validationError = validationResult(req);
    // 유효성 검사 통과 못할 경우 false
    if (false == validationError.isEmpty()) {
        responseResult.state = 400;
        responseResult.desc = validationError.errors[0].msg + '[' + validationError.errors[0].param + ']';
        res.status(responseResult.state).json(responseResult);
    }

    if (400 != responseResult.state) {
        let newProd = {
            prod_c: req.query.prod_c,
            prod_n: req.query.prod_n
        };

        Prod.create(newProd).then((r) => {
            responseResult.result = r;
        }).catch((err) => {
            console.error('product Add Error : ', err);
            responseResult.state = 500;
            responseResult.desc = 'product Add FAIL';
        })
        .then(()=>{
            res.status(responseResult.state).json(responseResult);
        });
    }
});

/**
*    @swagger
*    /api/products:
*    delete:
*      summary: 상품 제거
*      tags: [Product]
*      consumes:
*        - application/json
*      parameters:
*        - in: formData
*          name: prod_c
*          type: integer
*          description: 상품코드
*      responses:
*        200:
*          description: OK
*/
router.delete('/:prod_c', check('prod_c').isInt(), (req, res) => {
    let responseResult = {
        state: 200,
        desc: '',
        result: null
    }

    const validationError = validationResult(req);
     // 유효성 검사 통과 못할 경우 false
    if (false == validationError.isEmpty()) {
        console.log('validator fasle :' , validationError);
        responseResult.state = 400;
        responseResult.desc = validationError.errors[0].msg + '[' + validationError.errors[0].param + ']';
        res.status(responseResult.state).json(responseResult);
    };

    if (400 != responseResult.state) {
    Prod.delete(req.params.prod_c)
        .then((r) => {
            responseResult.result = r;
        })
        .catch((err) => {
            responseResult.state = 500;
            responseResult.desc = 'product DELETE FAIL';
        })
        .then(() => {
            res.status(responseResult.state).json(responseResult);
        })
    }
})

export default router;