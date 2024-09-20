const express = require("express");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  read,
  update,
  upload,
  getFiles,
  getData,
} = require("../controllers/user");

router.get("/user/:id", requireSignin, read);
router.put("/user/update", requireSignin, update);
router.put("/admin/update", requireSignin, adminMiddleware, update);
router.post("/upload", upload);
router.get("/getFiles/:email", getFiles);
router.get("/getData", getData);
module.exports = router;
