const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { expressjwt } = require("express-jwt");
const _ = require("lodash");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.APP_PASSWORD,
  },
});

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
      const token = jwt.sign(
        { name, email, password },
        process.env.JWT_ACCOUNT_ACTIVATION,
        { expiresIn: "10m" }
      );
      console.log(token);
      const mailOptions = {
        from: {
          name: "Admin",
          address: process.env.EMAIL_FROM,
        },
        to: [email],
        subject: "Account Activation Link",
        html: `<h1>Please use the following link to activate your account</h1>
        <center><p>[copy and paste the below url]</p></center>
        <u><p style="color: blue; cursor:pointer">${process.env.CLIENT_URL}/auth/activate/${token}</p></u>`,
        ContentType: "plainText",
        Charset: "utf-8",
        Content: "Activate your Account",
      };

      const sendMail = async (transporter, mailOptions) => {
        try {
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        } catch (err) {
          console.log(err);
        }
      };
      const callback = (err, data, response) => {
        if (err) {
          console.error(`err: ${err}`);
          res.status(200).json({
            failed: "ERROR IN CALLBACK",
            message: err.message,
          });
        } else {
          console.log("API called successfully");
          console.log("Email sent");
          console.log(req.body);
          res.status(200).json({
            success: "done",
            message: `Email is successfully sent to ${email}! Follow the instruction to activate your account.`,
          });
        }
      };
      sendMail(transporter, mailOptions);
      callback();
    })
    .catch((err) => {
      console.log("SIGNUP ERROR ", err);
      return res.status(400).json({
        error: err,
      });
    });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Expired link. Signup again",
          });
        }
        const { name, email, password } = jwt.decode(token);
        const rollNo = email.substring(0, 10);
        // console.log("######################################");
        // console.log(rollNo);
        // console.log("######################################");
        const user = new User({ name, email, password, rollNo });

        const savedUser = user
          .save()
          .then((user) => {
            res.json({
              message: "Signup success! Please signin",
            });
          })
          .catch((err) => {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again",
            });
          });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: `User with that email doesnot exist. Please signup`,
        });
      }
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Email and password do not match",
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: { _id, name, email, role },
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: `User with that email doesnot exist. Please signup`,
      });
    });
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.auth._id })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (user.role !== "admin") {
        return res.status(400).json({
          error: "Admin resource. Access denied",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      req.profile = user;
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        error: "User not found",
      });
    });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        console.log("FORGOT-PASSWORD ERROR ", err);
        return res.status(400).json({
          error: "User with that email does not exist",
        });
      }
      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: "10m" }
      );
      const mailOptions = {
        from: {
          name: "Admin",
          address: process.env.EMAIL_FROM,
        },
        to: [email],
        subject: "Password Reset Link",
        html: `<h1>Please use the following link to reset your password</h1>
        <center><p>[copy and paste the below url]</p></center>
        <u><p style="color: blue; cursor:pointer">${process.env.CLIENT_URL}/auth/password/reset/${token}</p></u>`,
        ContentType: "plainText",
        Charset: "utf-8",
        Content: "Password Reset Link",
      };
      return user
        .updateOne({ resetPasswordLink: token })
        .then(() => {
          const callback = (err, data, response) => {
            if (err) {
              console.error(`err: ${err}`);
              res.status(200).json({
                failed: "ERROR IN CALLBACK",
                message: err.message,
              });
            } else {
              console.log("API called successfully");
              console.log("Email sent");
              console.log(req.body);
              res.status(200).json({
                success: "done",
                message: `Email is successfully sent to ${email}! Follow the instruction to reset your password.`,
              });
            }
          };
          const sendMail = async (transporter, mailOptions) => {
            try {
              await transporter.sendMail(mailOptions);
              console.log("Email sent successfully");
            } catch (err) {
              console.log(err);
            }
          };
          sendMail(transporter, mailOptions);
          callback();
        })
        .catch((err) => {
          console.log("RESET-PASSWORD LINK ERROR", err);
          return res.status(400).json({
            error: "Database connection error on user password forgot request",
          });
        });
    });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          console.log("RESET-PASSWORD ERROR ", err);
          return res.status(400).json({
            error: "Expired link!. Try again",
          });
        }
        User.findOne({ resetPasswordLink })
          .exec()
          .then((user) => {
            if (!user) {
              console.log("RESET-PASSWORD ERROR ", err);
              return res.status(400).json({
                error: "Something went wrong. Try later",
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: "",
            };

            user = _.extend(user, updatedFields);

            const savedUser = user
              .save()
              .then((user) => {
                res.json({
                  message:
                    "Reset Password success! Now you can login with your new password",
                });
              })
              .catch((err) => {
                return res.status(400).json({
                  error: "Error resetting user password",
                });
              });
          })
          .catch((err) => {
            console.log("RESET-PASSWORD ERROR ", err);
            return res.status(400).json({
              error: "Something went wrong. Try later",
            });
          });
      }
    );
  }
};
