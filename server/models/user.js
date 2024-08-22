const mongoose = require("mongoose");

const crypto = require("crypto");
const { type } = require("os");

// const validateRollNo = function (value) {
//   const rollNoPattern =
//     /^21B81A(05|12|33|66|04|02|67|01|03|62|10)([0-9]{2}|[A-Z][1-9])$/i;
//   return rollNoPattern.test(value);
// };

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 32,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "student",
    },
    resetPasswordLink: {
      data: String,
      type: String,
      default: "",
    },
    files: {
      type: Array,
      default: [],
    },
    // rollNo: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   validate: [validateRollNo, "Invalid roll number format"],
    // },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
