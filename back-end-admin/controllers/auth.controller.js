const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./../models/user.model");
const { sendEmail } = require("../utils/mailer");


exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    await userModel.registerValidation(req.body).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const countOfRegisteredUsers = await userModel.countDocuments();

    // const hashedPassword = await bcrypt.hash(password, 12);
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: countOfRegisteredUsers > 0 ? "USER" : "ADMIN",
      // role: "USER",
      isBan: false,
      isEmailVerified: false
    });

    const userObject = user.toObject();

    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3 days",
      // expiresIn: "60 seconds",
    });

    sendEmail(
      email,
      username,
      "خوش آمدید",
      "ثبت نام شما با موفقیت انجام شد !",
    );

    return res.status(201).json({ message: "New user registered successfully !", user: userObject, accessToken });
  } catch (error) {
    next(error);
  }
};


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
