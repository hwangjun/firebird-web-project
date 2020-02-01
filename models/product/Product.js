// const mongoose = require('mongoose');
import mongoose from "mongoose"; 

let _this;

// 상품 스키마
const prodSchema = mongoose.Schema({
    productCode: {
        type: Number,
        require: true,
        unique: true,
        index: true
    },
    productName: {
        type: String,
        require: true,
        trim: true
    },
    categoryCode: {
        type: Number,
        default: 0,
        index: true
    },
    minPrice: {
        type: Number,
        default: 0
    },
    avgPrice: {
        type: Number,
        default: 0
    },
    modifyDate: {
        type: Date, 
        default: Date.now
    }
});

// Find All Product
prodSchema.statics.findAll = (query, skip, limit) => {
    return _this.find(query).skip(skip).limit(limit);
}

// Find Product
prodSchema.statics.findByProductCode = (productCode) => {
    return _this.find({ productCode });
}

// Insert Product
prodSchema.statics.create = (payload) => {
    const newProd = new _this(payload);
    return newProd.save();
}

// Update Category
prodSchema.statics.update = (payload) => {
    return _this.updateOne({ productCode: payload.productCode }, { $set: payload });
};

// Delete Product
prodSchema.statics.delete = (productCode) => {
    return _this.remove({ productCode });
}

_this = mongoose.model('Prod', prodSchema, 'TB_PRODUCT');
export default _this;
