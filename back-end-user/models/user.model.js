const mongoose = require("mongoose");
const { registerValidator, loginValidator , forgetPasswordValidator , resetPasswordValidator } = require("./../validators/auth.validator");
const { updateValidator , changePasswordValidator_ByUser } = require("./../validators/user.validator");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isBan: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//* add yup validation method to mongoose statics
//* register
userSchema.statics.registerValidation = function (body) {
  return registerValidator.validate(body, { abortEarly: false });
};
//* login
userSchema.statics.loginValidation = function (body) {
  return loginValidator.validate(body, { abortEarly: false });
};
//* forget password
userSchema.statics.forgetPasswordValidation = function (body) {
  return forgetPasswordValidator.validate(body, { abortEarly: false });
};
//* reset password
userSchema.statics.resetPasswordValidation = function (body) {
  return resetPasswordValidator.validate(body, { abortEarly: false });
};
//* update
userSchema.statics.updateValidation = function (body) {
  return updateValidator.validate(body, { abortEarly: false });
};
//* change password By User
userSchema.statics.changePasswordValidation_ByUser = function (body) {
  return changePasswordValidator_ByUser.validate(body, { abortEarly: false });
};


const model = mongoose.model("User", userSchema);
module.exports = model;
