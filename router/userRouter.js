const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, userController.userHomeGet);

module.exports = router;
