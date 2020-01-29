const util = {};

util.successTrue = (data, message = null) => { //1 
  return {
    success:true,
    message,
    errors:null,
    data,
  };
};

util.successFalse = (err, message = null) => { //2
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

util.parseError = (errors) => { //3
  const parsed = {};
  if(errors.name == 'ValidationError'){
    for(let name in errors.errors){
      const validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('email') > 0) {
    parsed.email = { message:'This email already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};

// module.exports = util;
export default util;