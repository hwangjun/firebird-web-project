const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Prod = require('../../models/product/Product');

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
        message: '',
        result: null
    }

    // validation 정의
    const schema = Joi.object({
        prodName: Joi.string(),
        offset: Joi.number().default(0),
        limit: Joi.number().default(10)
    });

    // 체크
    const {error, value} = schema.validate(req.query);
    if (error) {
        responseResult.state = 400;
        responseResult.message = error;
    }
    
    if (200 == responseResult.state) {
        let query = {};
        let skip = value.offset;
        let limit = value.limit;

        if (value.prodName) {
            // like
            query['productName'] = { $regex: '.*' + value.prodName + '.*' }
        }
        
        Prod.findAll(query, skip, limit)
            .then((r) => {
                responseResult.result = r;
            })
            .catch((err) => {
                responseResult.state = 500;
                responseResult.message = 'productList Search FAIL';
            })
            .then(() => {
                res.status(responseResult.state).json(responseResult);
            });
    } else {
        res.status(responseResult.state).json(responseResult);
    }
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
router.get('/:productCode', (req, res) => {
    let responseResult = {
        state: 200,
        message: '',
        result: null
    }

    // validation 정의
    const schema = Joi.object({
        productCode: Joi.number()
    });

    // 체크
    const {error, value} = schema.validate(req.params);
    if (error) {
        responseResult.state = 400;
        responseResult.message = error;
    }

    if (200 == responseResult.state) {
        Prod.findByProductCode(value.productCode)
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
    } else {
        res.status(responseResult.state).json(responseResult);
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
router.post('/', (req, res, next) => {
    let responseResult = {
        state: 200,
        message: '',
        result: null
    }

    // validation 정의
    const schema = Joi.object({
        //productCode: Joi.number().required(),
        productName: Joi.string().required(),
        categoryCode: Joi.number().required()
    });

    // validation 체크
    const {error, value} = schema.validate(req.body);
    if (null != error) {
        responseResult.state = 400;
        responseResult.message = error;
    }

    if (200 == responseResult.state) {
        let newProd = {
            //productCode: value.productCode,
            productName: value.productName,
            categoryCode: value.categoryCode
        };

        Prod.create(newProd).then((r) => {
            responseResult.result = r;
        }).catch((err) => {
            console.error('product Add Error : ', err);
            responseResult.state = 500;
            responseResult.message = 'product Add FAIL';
        })
        .then(()=>{
            res.status(responseResult.state).json(responseResult);
        });
    } else {
        res.status(responseResult.state).json(responseResult);
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
router.delete('/:productCode', (req, res) => {
    let responseResult = {
        state: 200,
        message: '',
        result: null
    }

    // validation 정의
    const schema = Joi.object({
        productCode: Joi.number()
    });

    // 체크
    const {error, value} = schema.validate(req.params);
    if (null != error) {
        responseResult.state = 400;
        responseResult.message = error;
    }

    if (200 == responseResult.state) {
    Prod.delete(value.productCode)
        .then((r) => {
            responseResult.result = r;
        })
        .catch((err) => {
            responseResult.state = 500;
            responseResult.message = 'product DELETE FAIL';
        })
        .then(() => {
            res.status(responseResult.state).json(responseResult);
        })
    } else {
        res.status(responseResult.state).json(responseResult);
    }
})

module.exports = router;