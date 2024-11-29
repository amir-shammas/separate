const bcrypt = require("bcrypt");
const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");


// ////////////////////////////////////////////  USER - CONTROLLERS  ///////////////////////////////////////////


exports.updateUser = async (req, res, next) => {

  try{

    const { name, username, email } = req.body;

    const id = String(req.user._id);

    await userModel.updateValidation({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });

    if (userExists) {
      return res.status(409).json({
        message: "username or email is duplicated.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "user updated successfully !", data: user});

  }catch(error){
    next(error);
  }

};


exports.changeUserPassword = async (req, res, next) => {

  try{

    const { currentPassword, password, confirmPassword } = req.body;
    
    const id = String(req.user._id);

    const currentUser = await userModel.findById(id);

    if (!currentUser) {
      return res.status(401).json("There is no user with this id !");
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, String(currentUser.password));

    if (!isCurrentPasswordCorrect) {
      return res.status(452).json({ message: "current password is not correct !" });
    }

    await userModel.changePasswordValidation_ByUser({...req.body , id}).catch((err) => {
      err.statusCode = 400;
      throw err;
    });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await userModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      }
    );

    if (!user) {
      return res.status(404).json("user not found !");
    }

    return res.status(200).json({status: 200, message: "password changed successfully !", data: user});

  }catch(error){
    next(error);
  }
};


exports.sendLinkForVerifyEmail = async (req, res, next) => {

  try{

    const token = jwt.sign({ id: String(req.user._id) }, process.env.JWT_SECRET, {
      expiresIn: "5 minutes",
    });

    const verifyEmailLink = `http://localhost:3000/my-account/verify-email/${token}`;

    sendEmail(
      String(req.user.email),
      String(req.user.username),
      "تایید ایمیل",
      `
        برای تایید ایمیل روی لینک زیر کلیک کنید
        <br>
        <a href="${verifyEmailLink}">لینک تایید ایمیل</a>
      `
    );

    return res.status(200).json({ message: "Reset link mailed successfully !" });
    // return res.status(200).json({ message: "verifyEmail link mailed successfully !" , token: token });

  }catch(error){
    next(error);
  }

};


exports.verifyEmail = async (req, res, next) => {

  try{

    const token = req.params.token;

    if (!token) {
      return res.status(401).json({
        message: "Token is required !",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Token is not verified !",
      });
    }

    const user = await userModel.findOne({ _id: decodedToken.id });

    if (!user) {
      return res.status(404).json("user not found !");
    }

    user.isEmailVerified = true;

    await user.save();

    res.status(200).json({ message: "email verified successfully !" });

  }catch(error){
    next(error);
  }

}
