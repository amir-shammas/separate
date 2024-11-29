const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./../models/user.model");
const { sendEmail } = require("../utils/mailer");


exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    await userModel.loginValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json("There is no user with this email or username");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "password is not correct" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
      // expiresIn: "60 seconds",
    });

    return res.json({ accessToken });
    
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    return res.json({ ...req.user });
  } catch (error) {
    next(error);
  }
};
