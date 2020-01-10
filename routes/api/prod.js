const express = require('express');
const router = express.Router();
const Prod = require('../../models/ProdModel');


router.get('/', async (req, res) => {
    console.log('/prod Call');
    let prodList = await Prod.find({prod_c: 'aaaaa'});
    console.log(prodList);
    res.json(prodList);
});

router.get('/add', async (req, res, next) => {
    console.log('/add Call1');
    let result = {
        state: 200,
        desc: '',
        data: null
    }
    
    let newProd = {
        prod_c: req.query.prod_c,
        prod_n: req.query.prod_n
    };

    let addResult = await Prod.addProd(newProd);
    result['data'] = addResult;
    console.log('result : ', result);
    console.log('/add Call2');
    
    res.status(201).json(result);
});

module.exports = router;