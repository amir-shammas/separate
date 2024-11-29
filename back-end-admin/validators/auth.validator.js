const yup = require("yup");


//* Login Schema
const loginValidator = yup.object().shape({
  identifier: yup.string().required(" ایمیل الزامی است"),
  password: yup.string().required(" کلمه عبور الزامی است"),
});


module.exports = {
  loginValidator,
};
