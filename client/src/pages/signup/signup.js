import {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import {useSelector, connect, useDispatch} from "react-redux";
import {Form, withFormik, Field} from "formik";
import TextField from "@mui/material/TextField";
import {Link} from "react-router-dom";
import {styled} from "@mui/material/styles";
import {Avatar, Button} from "@mui/material";
import PhoneInput, {isValidPhoneNumber} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CircularProgress from "@mui/material/CircularProgress";

import {WhatsappIcon} from "../../icons";
import {SignupValidationSchema} from "../../yup/yup";
import {signUpUser} from "../../store/actions/user";
import {CLEAR_USER_ERROR} from "../../store/types/user";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#5fc8bc",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#5fc8bc",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "#808080",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5fc8bc",
    },
  },
});

const SignupPage = ({
  values, //GOTTEN FROM FORMIK INBUILT PROPS
  touched, //GOTTEN FROM FORMIK INBUILT PROPS
  errors, //GOTTEN FROM FORMIK INBUILT PROPS
  setFieldValue, //GOTTEN FROM FORMIK INBUILT PROPS
  setFieldTouched, //GOTTEN FROM FORMIK INBUILT PROPS
}) => {
  //CHECK IF PHONE NUMBER INPUT IS ACTIVE
  const [inputActive, setInputActive] = useState(false);
  //CHECK IF INPUTED NUMBER IS VALID
  const [numIsValid, setNumIsValid] = useState(null);

  //GETTING VALUES FROM REDUX STATE..
  const theme = useSelector(state => state.app.theme);
  const signingUp = useSelector(state => state.user.signingUp);
  const authError = useSelector(state => state.user.authError);
  const token = useSelector(state => state.user.token);

  const dispatch = useDispatch();

  const handlePhoneInputChange = e => {
    setFieldValue("phone_number", e, true);
  };

  //TO HANDLE PHONEINPUT ERRORS AND CHECK IF NUMBER IS VALID
  const handleBlur = () => {
    const isValid =
      values.phone_number && isValidPhoneNumber(values.phone_number);
    setNumIsValid(isValid);
    setInputActive(false);
    setFieldTouched("phone_number", true, true);
  };

  //CLEAR ERROR FIELD ONCE COMPONENT RE-RENDERS TO AVOID SHOWING SAME ERROR MESSAGE ON BOTH SIGNUP AND SIGNIN PAGE AND WHEN USER REVISITS EITHER PAGE ERROR
  useEffect(() => {
    dispatch({
      type: CLEAR_USER_ERROR,
    });
  }, [dispatch]);

  if (token) return <Navigate to="/" />;
  return (
    <div className={`auth-pages-${theme}-theme-container`}>
      <div className="auth-pages-header-container">
        <div>
          <WhatsappIcon height={40} width={40} />
          <p>Whatsapp Web Clone By Olaniran-Sulaimon</p>
        </div>
      </div>

      <div className="auth-pages-body-container">
        <div className="auth-pages-body-form-container">
          <h1>Join O-S Whatsapp Web Clone Messenger</h1>
          <div className="auth-pages-body-form-avatar-container">
            <Avatar
              src="https://i.pinimg.com/originals/ba/e0/9f/bae09fb6806e1c176c0c1fdcebabfb34.jpg"
              alt=""
            />
          </div>
          <Form>
            <Field
              type="text"
              name="username"
              id="username"
              as={CssTextField}
              value={values.username}
              placeholder="Enter your username"
              error={touched.username && errors.username ? true : false}
              helperText={touched.username && errors.username}
            />

            <div className="form-phone-input-container">
              <Field
                as={PhoneInput}
                onChange={e => handlePhoneInputChange(e)}
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                value={values.phone_number}
                placeholder="Enter your phone number"
                name="phone_number"
                id="phone_number"
                onFocus={() => setInputActive(true)}
                onBlur={handleBlur}
                className={`${inputActive ? "input-active" : ""}`}
              />
              {touched.phone_number && errors.phone_number && (
                <small>{errors.phone_number}</small>
              )}
              {touched.phone_number && !errors.phone_number && !numIsValid && (
                <small>Enter a valid phone number</small>
              )}
            </div>

            <Field
              type="password"
              name="password"
              id="password"
              as={CssTextField}
              value={values.password}
              placeholder="Enter account password"
              error={touched.password && errors.password ? true : false}
              helperText={touched.password && errors.password}
            />

            <Field
              type="password"
              name="confirm_password"
              id="confirm_password"
              as={CssTextField}
              value={values.confirm_password}
              placeholder="Confirm password"
              error={
                touched.confirm_password && errors.confirm_password
                  ? true
                  : false
              }
              helperText={touched.confirm_password && errors.confirm_password}
            />

            <Field
              variant="contained"
              as={Button}
              type="submit"
              name="submit-button"
              id="submit-button"
              disabled={signingUp}
            >
              {signingUp ? <CircularProgress size="small" /> : "Sign Up"}
            </Field>
          </Form>

          <div className="auth-pages-body-footer-container">
            <p>
              Already a user?
              <Link to="/signin">
                <Button>Log in</Button>
              </Link>
            </p>
          </div>

          {authError && (
            <div className="auth-pages-error-container">
              <small>{authError}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FormikSignupPage = withFormik({
  mapPropsToValues() {
    return {
      username: "",
      phone_number: "",
      password: "",
      confirm_password: "",
    };
  },

  validationSchema: SignupValidationSchema,

  handleSubmit(values, {props}) {
    const {signUpUser} = props;
    signUpUser(values);
  },
})(SignupPage);

//NOT USING USEDISPATCH SO AS TO BE ABLE TO ACCESS THIS ACTION IN FORMIK HANDLESUBMIT
const mapDispatchToProps = dispatch => {
  return {
    signUpUser: data => dispatch(signUpUser(data)),
  };
};

export default connect(null, mapDispatchToProps)(FormikSignupPage);
