const yup = require("yup");


const updateValidator = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  name: yup
    .string()
    .required("نام و نام خانوادگی الزامی می‌باشد")
    .min(3, "نام و نام خانوادگی نباید کمتر از 3 کاراکتر باشد")
    .max(10, "نام و نام خانوادگی نباید بیشتر از 10 کاراکتر باشد"),
  username: yup
    .string()
    .required("نام کاربری الزامی می‌باشد"),
  email: yup
    .string()
    .email("آدرس ایمیل نامعتبر است")
    .required("آدرس ایمیل الزامی می‌باشد"),
});


const changePasswordValidator_ByUser = yup.object().shape({
  id: yup
    .string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),
  currentPassword: yup
    .string()
    .required("رمز عبور فعلی الزامی می‌باشد"),
  password: yup
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .required("رمز عبور الزامی می‌باشد"),
  confirmPassword: yup
    .string()
    .required("تکرار کلمه عبور الزامی می باشد")
    .oneOf([yup.ref("password"), null], "کلمه ی عبور و تکرار آن یکسان نیستند"),
});


module.exports = {
  updateValidator,
  changePasswordValidator_ByUser,
};
