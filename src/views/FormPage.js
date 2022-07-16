import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import Loader from '../components/Loader';
import { checkUserAlreadyLoggedIn } from '../utils/reusableFunctions'
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

// import Alert from "@material-ui/lab/Alert";
import {
  Button,
} from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import CustomizedTextField from '../components/CustomizedTextField;';


const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: "5.6rem 2rem",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "2rem",
    },
  },
  formWrapper: {
    background: "#FFFFFF",
    boxShadow: "0px 24px 40px rgba(3, 23, 111, 0.06)",
    borderRadius: "16px",
    height: "100%",
    padding: "2.4rem 2.4rem 4rem 2.4rem",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "26px",
    lineHeight: "28px",
    fontWeight: "600",

    [theme.breakpoints.down("xs")]: {
      marginBottom: "0.8rem",
      fontSize: "20px",
      lineHeight: "28px",
      fontWeight: "600",
    },
  },

  hiddenDiv: {
    padding: "0px 12px !important",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  submitButton: {
    background: "linear-gradient(127.18deg, #3846FE 0.93%, #6C76FE 98.36%)",
    color: "#FFFFFF",
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom:'1rem',
    padding: "1.6rem 3.2rem",
    borderRadius: "8px",
    lineHeight: "24px",
    letterSpacing: "0.02em",

    "&:hover": {
      background: "linear-gradient(127.18deg, #3846FE 0.93%, #6C76FE 98.36%)",
    },
    textTransform: "none",
    width: "30%",
    [theme.breakpoints.down("xs")]: {
      width: "30%",
      padding: "16px 20px",
    },
  },

  bottomButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  toogleSignup: {
    fontSize: "18px",
    color:"#3846FE"
},
  errorText: {
    fontSize: "14px",
    fontWeight: "400",
  },
  alertError: {
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "24px",
    borderRadius: 6,
    color: "#EA6A6A",
  },
  
}));


export default function FormPage() {
    const history = useHistory()
    const [isSignUp,setIsSignUp]=useState(false)
    
    if (checkUserAlreadyLoggedIn()) {
        history.push('/home')
        return <Loader />
  }
  const classes = useStyles();

  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    password: "",
    email: "",
    otherErrors: "",
  });

  // const [finalValues, setFinalValues] = useState({});

  const [loading, setLoading] = useState(false);

  const formValidator = (field, val, isOnSubmit = false) => {
    const value = typeof val === "string" ? val.trim() : val;
    const newErrors = {};
    switch (field) {
      case "username":
        if (!value) newErrors.username = "Please complete this required field.";
        else newErrors.username = "";
        break;

      case "email":
        if (!value) newErrors.email = "Please complete this required field.";
        else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/.test(value))
          newErrors.email = "Email format is not correct.";
        else newErrors.email = "";
        break;

      case "password":
        if (value?.length < 6) newErrors.password = "Password must contain minimum 6 characters";
        else if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value))
          newErrors.password = "Password must contain atleast one capital letter, a small letter, a number, a special character";
        else newErrors.password = "";
        break;

      default:
    }

    if (isOnSubmit) return newErrors;

    setErrors({ ...errors, ...newErrors });
    return false;
  };

  const onBlurHandler = ({ target }) => {
    const { name, value } = target;
    formValidator(name, value);
  };

  const onInputChange = ({ target }) => {
    const { name } = target;
    let { value } = target;
    // console.log(name,value);
    if (name === "email") value = target.value.trim().toLowerCase();

    setValues({
      ...values,
      [name]: value,
    });

    formValidator(name, value);
  };

  // console.log(values);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let newErr;
    for (const [field, value] of Object.entries(values)) {
      newErr = formValidator(field, value, true);
      newErrors[field] = newErr[field];
    }

    setErrors(newErrors);

    for (const field of Object.keys(newErrors))
      if (newErrors[field]) return false;


    setLoading(true);
    return true;
  };

  const toggleSignUp = (path) => {
    setIsSignUp(!isSignUp);
    history.push('/path');
  }


  return (
    <div className={classes.container}>
      <div className={classes.formWrapper}>
        <Typography variant="h6" className={classes.title}>
          {isSignUp? 'Sign up':'Sign in'}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12}>
              {isSignUp && (<CustomizedTextField
                label="User name *"
                value={values.name}
                name="username"
                onInputChange={onInputChange}
                onBlurHandler={onBlurHandler}
                error={!!errors?.name}
                helperText={errors.name}
              />)}
            </Grid>
            {/* email */}
            <Grid item xs={12}>
              <CustomizedTextField
                name="email"
                label="Email address *"
                value={values.email}
                onInputChange={onInputChange}
                onBlurHandler={onBlurHandler}
                error={!!errors?.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomizedTextField
                name="password"
                label="Password *"
                value={values.password}
                onInputChange={onInputChange}
                onBlurHandler={onBlurHandler}
                error={!!errors?.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12} align="center" className={classes.bottomButton}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  disableElevation
                  disableRipple
                  className={classes.submitButton}
                  type="submit"
                >
                  {isSignUp? 'Sign up':'Sign in'}
                  </Button>
                  
              )}
              Or
              <div className={classes.toogleSignup} onClick={() => toggleSignUp( isSignUp ? 'signin' : 'signup') }>{isSignUp?'Alraedy have an account':'Create new account'}</div>
            </Grid>
            <Grid item xs={12}>
              
               
            </Grid>
            {errors.otherErrors && (
              <Grid item xs={12} className={classes.hiddenDiv}>
                <Typography variant="body2" className={classes.alertError}>
                  {errors.otherErrors}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </div>
    </div>
  )
}
