const mongoose = require('mongoose');

let _this;

const partnerProductSchema = mongoose.Schema({
    linkYN: {
        type: String,
        default: 'N',
        index: true
    },
    partnerCode: {
        type: String,
        require: true,
        index: true,
        trim: true,
        uppercase: true
    },
    partnerProductCode: {
        type: String,
        require: true,
        trim: true,
        index: true
    },
    categoryCode: {
        type: Number,
        default: 0,
        index: true
    },
    partnerProductName: {
        type: String,
        require: true,
        trim: true
    },
    productURL: {
        type: String,
        trim: true
    },
    imageURL: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },
    modifyDate: {
        type: Date,
        default: Date.now
    }
});

// Insert Product
partnerProductSchema.statics.create = (payload) => {
    const newProd = new _this(payload);
    return newProd.save();
}

_this = mongoose.model('PartnerProduct', partnerProductSchema, 'TB_PARTNER_PRODUCT');
module.exports = _this;