const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),

  check("email").isEmail().withMessage("Must be a valid email"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),

  check("rollNo")
    .not()
    .matches(/^21B81A(05|12|33|66|04|02|67|01|03|62|10)([0-9]{2}|[A-Z][1-9])$/i)
    .withMessage("Invalid roll number format"),
];

exports.userSigninValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters"),

  check("rollNo")
    .not()
    .matches(/^21B81A(05|12|33|66|04|02|67|01|03|62|10)([0-9]{2}|[A-Z][1-9])$/i)
    .withMessage("Invalid roll number format"),
];

exports.forgotPasswordValidator = [
  check("email")
    .isEmail()
    .not()
    .isEmpty()
    .withMessage("Must be a valid email address"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters"),
];
