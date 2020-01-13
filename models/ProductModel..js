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

prodSchema.statics.getProduct = function (prod_c) {
    return this.find({prod_c: prod_c});
}

prodSchema.statics.getProductList = function (query, skip, limit) {
    return this.find(query).skip(skip).limit(limit);
}

prodSchema.statics.addProduct = function (prod) {
    const newProd = new this(prod);
    return newProd.save();
}

prodSchema.statics.deleteProduct = function (prod_c) {
    return this.deleteOne({prod_c: prod_c});
}

module.exports = mongoose.model('Prod', prodSchema, 'TB_PROD');