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
import {SigninValidationSchema} from "../../yup/yup";
import {signInUser} from "../../store/actions/user";
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

const SigninPage = ({
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
  const signingIn = useSelector(state => state.user.signingIn);
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
          <h1>Welcome back to O-S Whatsapp Web Clone Messenger</h1>
          <div className="auth-pages-body-form-avatar-container">
            <Avatar
              src="https://i.pinimg.com/736x/de/5d/6d/de5d6d73b33a37be876d3b8ac22c1cbf.jpg"
              alt=""
            />
          </div>
          <Form>
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
              placeholder="Input your password"
              error={touched.password && errors.password ? true : false}
              helperText={touched.password && errors.password}
            />

            <Field
              variant="contained"
              as={Button}
              type="submit"
              name="submit-button"
              id="submit-button"
              disabled={signingIn}
            >
              {signingIn ? <CircularProgress size="small" /> : "Log In"}
            </Field>
          </Form>

          <div className="auth-pages-body-footer-container">
            <p>
              Don't have an account?
              <Link to="/signup">
                <Button>Create one</Button>
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

const FormikSigninPage = withFormik({
  mapPropsToValues() {
    return {
      phone_number: "",
      password: "",
    };
  },

  validationSchema: SigninValidationSchema,

  handleSubmit(values, {props}) {
    const {signInUser} = props;
    signInUser(values);
  },
})(SigninPage);

//NOT USING USEDISPATCH SO AS TO BE ABLE TO ACCESS THIS ACTION IN FORMIK HANDLESUBMIT
const mapDispatchToProps = dispatch => {
  return {
    signInUser: data => dispatch(signInUser(data)),
  };
};

export default connect(null, mapDispatchToProps)(FormikSigninPage);
