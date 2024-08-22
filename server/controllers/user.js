const User = require("../models/user");

exports.read = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "User not found",
      });
    });
};

exports.update = (req, res) => {
  const { name, password } = req.body;

  User.findOne({ _id: req.auth._id })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      } else {
        user.name = name;
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password must be atleast 6 characters long",
          });
        } else {
          user.password = password;
        }
      }
      user
        .save()
        .then((updatedUser) => {
          updatedUser.hashed_password = undefined;
          updatedUser.salt = undefined;
          res.json(updatedUser);
          console.log(req);
        })
        .catch((err) => {
          console.log("USER UPDATE ERROR!");
          return res.status(400).json({
            error: "User update failed",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "User not found",
      });
    });
};

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const up = multer({ storage: storage });
// exports.upload = async (req, res) => {
//   up.single("file")(req, res, async function (err) {
//     if (err) {
//       return res.status(500).json({ error: "File upload failed" });
//     }
//     // console.log("@@@@@@@@@@@@@@@@@@@@@@");
//     // console.log(req.body.label);
//     // console.log("@@@@@@@@@@@@@@@@@@@@@@");
//     const fileName = req.file.originalname;
//     const user = JSON.parse(req.body.user);
//     const label = req.body.label;

//     // try {
//     //   const foundUser = await User.findOne({ email: user.email }).exec();

//     //   if (!foundUser) {
//     //     return res.status(404).json({ error: "User not found" });
//     //   }
//     //   console.log(foundUser.files.length == 0);
//     //   flag = false;
//     //   if (foundUser.files.length !== 0) {
//     //     foundUser.files.forEach((file) => {
//     //       if (!flag && file.label === label) {
//     //         file.fileName = fileName;
//     //         console.log(file);
//     //         flag = true;
//     //       }
//     //     });
//     //     if (!flag) {
//     //       foundUser.files.push({ label, fileName });
//     //     }
//     //   } else {
//     //     console.log("empty");
//     //     foundUser.files.push({ label, fileName });
//     //     console.log(foundUser.files);
//     //   }

//     //   foundUser.save().then(() => console.log("saved"));
//     //   // console.log("saved ", updatedUser);

//     //   // return res.status(200).json({
//     //   //   message: "File uploaded successfully",
//     //   //   // files: updatedUser.files,
//     //   // });

//     try {
//       return User.findOneAndUpdate({ email: user.email }).then((user) => {
//         const files = user.files;

//         console.log(">>>>>>>>>>>>>>>>>>>>.....");
//         flag = false;
//         if (user.files.length !== 0) {
//           user.files.forEach((file) => {
//             if (!flag && file.label === label) {
//               file.fileName = fileName;
//               console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//               console.log(user);
//               console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
//               console.log("label: " + label);
//               console.log(user.files[0].label);
//               // user.files[0].label = fileName;
//               console.log(file);
//               flag = true;
//             }
//           });
//           if (!flag) {
//             user.files.push({ label, fileName });
//           }
//         } else {
//           console.log("empty");
//           user.files.push({ label, fileName });
//           // console.log(user.files);
//         }

//         user.save().then(() => console.log("saved"));
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ error: "Something went wrong" });
//     }

//     // try {
//     //   await User.findOne({ email: user.email })
//     //     .exec()
//     //     .then((foundUser) => {
//     //       if (!foundUser) {
//     //         return res.status(404).json({ error: "User not found" });
//     //       }
//     //       console.log(foundUser);
//     //       foundUser.files.forEach((file) => {
//     //         // console.log(file);
//     //         if (file.label === label) file.fileName = fileName;
//     //         // console.log(file);
//     //       });
//     //       console.log(foundUser);
//     //       foundUser.save().then((updatedUser) => {
//     //         console.log("saved ", updatedUser);
//     //       });
//     //       // return res.status(200).json({
//     //       //   message: "File uploaded successfully",
//     //       //   // files: updatedUser.files,
//     //       // });
//     //     });
//     // } catch (err) {
//     //   console.log(err);
//     //   return res.status(500).json({ error: "Something went wrong" });
//     // }
//   });
// };

exports.upload = async (req, res) => {
  up.single("file")(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const fileName = req.file.originalname;
    const user = JSON.parse(req.body.user);
    const label = req.body.label;

    try {
      const foundUser = await User.findOne({ email: user.email }).exec();

      if (!foundUser) {
        return res.status(404).json({ error: "User not found" });
      }

      let flag = false;

      foundUser.files.forEach((file) => {
        if (file.label === label) {
          file.fileName = fileName;
          flag = true;
        }
      });

      if (!flag) {
        foundUser.files.push({ label, fileName });
      }

      foundUser.markModified("files");
      await foundUser.save();

      return res.status(200).json({
        message: "File uploaded successfully",
        files: foundUser.files,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  });
};

exports.getFiles = async (req, res) => {
  try {
    const email = req.params.email;
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log(foundUser);
    // console.log("===========================================");
    // console.log(foundUser.files);

    return res.status(200).json({ files: foundUser.files });
  } catch (error) {
    console.error("Error fetching files:", error);
    // return res.status(500).json({ error: "Something went wrong" });
  }
};
