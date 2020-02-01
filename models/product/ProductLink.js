const mongoose = require('mongoose');

let _this;

// 스키마 설정
const linkSchema = mongoose.Schema({
    productCode: {
        type: Number,
        require: true,
        index: true
    },
    partnerCode: {
        type: String,
        require: true,
        uppercase: true,
        trim: true
    },
    partnerProductCode: {
        type: String,
        require: true,
        trim: true
    }
});

// Insert Product
linkSchema.statics.create = (payload) => {
    const newLink = new _this(payload);
    return newLink.save();
}

_this = mongoose.model('Link', linkSchema, 'TB_PRODUCT_LINK');
module.exports = _this;