const { validationResult } = require("express-validator");
const { ValidationError } = require("../utils/errors");

const validate = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errArray = errors.array();
      throw new ValidationError({ ...errArray[0] });
    } else next();
  } catch (err) {
    next(err);
  }
};
module.exports = validate;
