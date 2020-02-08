// const mongoose = require('mongoose');
import mongoose from "mongoose";

let _this;

const partnerProductSchema = mongoose.Schema({
  linkYN: {
    type: String,
    default: "N",
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
    trim: true,
    default: ""
  },
  imageURL: {
    type: String,
    trim: true,
    default: ""
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

partnerProductSchema.statics.findAll = (query, skip, limit) => {
  return _this
    .find(query)
    .skip(skip)
    .limit(limit);
};

// Insert Product
partnerProductSchema.statics.create = payload => {
  const newProd = new _this(payload);
  return newProd.save();
};

// Delete Product
partnerProductSchema.statics.delete = payload => {
  return _this.remove({ payload });
};

_this = mongoose.model(
  "PartnerProduct",
  partnerProductSchema,
  "TB_PARTNER_PRODUCT"
);
// module.exports = _this;
export default _this;
