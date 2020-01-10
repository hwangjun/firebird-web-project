const mongoose = require('mongoose');

// 상품 스키마
const prodSchema = mongoose.Schema({
    prod_c: {
        type: Number,
        require: true,
        unique: true
    },
    prod_n: {
        type: String,
        require: true
    },
    minprice_q: {
        type: Number,
        default: 0
    },
    avgprice_q: {
        type: Number,
        default: 0
    },
    make_d: {
        type: Date,
        default: Date.now
    },
    input_d: {
        type: Date,
        default: Date.now
    },
    modify_d: {
        type: Date,
        default: Date.now
    },
    shop_q: {
        type: Number,
        default: 0
    },
});

prodSchema.statics.addProd = function (prod) {
    const newProd = new this(prod);
    return newProd.save();
}

module.exports = mongoose.model('Prod', prodSchema, 'TB_PROD');