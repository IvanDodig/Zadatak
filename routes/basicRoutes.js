const express = require("express");
const authController = require("../controllers/basicController");

const router = express.Router();

router.get("/", authController.basic_index);
router.get("/create", authController.basic_create_get);
router.post("/create", authController.basic_create_post);

module.exports = router;
