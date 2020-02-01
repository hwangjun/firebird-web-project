// const express = require('express');
// const router = express.Router();
import express from "express";
const router = express.router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next){
  res.send('test');
});

// module.exports = router;
export default router;

