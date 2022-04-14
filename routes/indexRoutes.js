const express = require("express");
const router = express.Router();
const upload = require("../data/uploads");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
// Single file Upload - image key should be passed postman
router.post("/single", upload.single("image"), (req, res, next) => {
  console.log(req.file);  // UPLOADED FILE DESCRIPTION RECEIVED
  res.send("uploaded successfully");
});
// Multiple files Upload - images key should be passed in postman
router.post("/multiple", upload.array("images"), (req, res) => {
  console.log(req.files); // UPLOADED FILE DESCRIPTION RECEIVED
  res.send({
    status: "success",
    message: "Files uploaded successfully",
    data: req.files,
  });
});
module.exports = router;