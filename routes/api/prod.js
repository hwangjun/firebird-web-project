const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Prod = require('../../models/ProdModel');

/**
 * 상품 조회
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
        Prod.getProd(req.params.prod_c)
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
 * 상품 리스트 조회
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

    Prod.getProductList(query, skip, limit)
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
 * 상품 추가
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

        Prod.addProduct(newProd).then((r) => {
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
 * 상품 삭제
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
    Prod.deleteProduct(req.params.prod_c)
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

module.exports = router;