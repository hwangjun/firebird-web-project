const router = require('express').Router();
const Category = require('../../models/CategoryModel');

// Find All Category
router.get('/', (req, res) => {
    Category.findAll().then((category) => {
        if (!category.length) return res.status(404).send({ err: 'Category not found' });
        // res.send(`find successfully: ${category}`);
        res.send(category);
    })
    .catch(err => res.status(500).send(err));
});

// Find Category By categoryCode
router.get('/:categoryCode', (req, res) => {
    Category.findByCategoryCode(req.params.categoryCode).then((category) => {
      if (!category) return res.status(404).send({ err: 'Category not found' });
        // res.send(`findByCategoryCode successfully: ${category}`);
        res.send(category);
    })
    .catch(err => res.status(500).send(err));
});
  
module.exports = router;