const mongoose = require('mongoose');

let _this;

// 상품 스키마
const prodSchema = mongoose.Schema({
    prod_c: {                           // 기준상품 코드
        type: Number,
        require: true,
        unique: true
    },
    prod_n: {                           // 기준상품명
        type: String,
        require: true
    },
    minprice_q: {                       // 최저가
        type: Number,
        default: 0
    },
    avgprice_q: {                       // 평균가
        type: Number,
        default: 0
    },
    make_d: {                           // 제조일
        type: Date,
        default: Date.now
    },
    input_d: {
        type: Date,
        default: Date.now
    },
    modify_d: {                         // 수정일
        type: Date,
        default: Date.now
    },
    shop_q: {
        type: Number,
        default: 0
    },
});

// Find All Product
prodSchema.statics.findAll = (query, skip, limit) => {
    return _this.find(query).skip(skip).limit(limit);
}

// Find Product
prodSchema.statics.findByProductCode = (prod_c) => {
    return _this.find({ prod_c });
}

// Insert Product
prodSchema.statics.create = (prod) => {
    const newProd = new _this(prod);
    return newProd.save();
}

// Update Category
prodSchema.statics.update = (payload) => {
    return _this.updateOne({ prod_c: payload.prod_c }, { $set: payload });
};

// Delete Product
prodSchema.statics.delete = (prod_c) => {
    return _this.remove({ prod_c });
}

_this = mongoose.model('Prod', prodSchema, 'TB_PROD');
module.exports = _this;