const express = require("express");

const authController = require("./../controllers/auth.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");

const router = express.Router();


router.post("/login", authController.login);
router.get("/me", isAuthenticated, authController.getMe);


module.exports = router;
