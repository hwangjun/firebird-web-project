// const jwt = require('jsonwebtoken');
// const User = require('../models/user/User');
// const util = require('../common/util');
import jwt from "jsonwebtoken";
import User from "../models/user/User";
import util from "../common/util";

const isLoggedin  = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['authorization'] || req.query.token

    // token does not exist, undefind
    if(!token) {
        return res.status(403).json({
            success: "false",
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: "false",
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

//관리자 권한 체크 추가 예정
const checkPermission = (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) return res.json(util.successFalse(err));
        else if (!req.decoded || user._id != req.decoded._id)
            return res.json(util.successFalse(null, 'You don\'t have permission'));
        else next();
    });
}



export {
    isLoggedin ,
    checkPermission
}

