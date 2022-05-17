import * as yup from "yup";

export const SignupValidationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Create a password for your account.")
    .min(8, "Min of 8 characters"),

  confirm_password: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Retyped password don't match password!"
    )
    .required("Please confirm your password")
    .min(8, "Min of 8 characters"),

  username: yup
    .string()
    .required("Please proivde a username.")
    .min(2, "Username cannot contain less than 2 Letters.")
    .test("alphabets", "Name must only contain alphabets.", value => {
      return /^[a-zA-Z\s]+$/.test(value);
    }),

  phone_number: yup.number().required("Please enter your phone number."),
});

export const SigninValidationSchema = yup.object().shape({
  phone_number: yup.number().required("Please enter your phone number."),

  password: yup.string().required("Enter correct password"),
});
