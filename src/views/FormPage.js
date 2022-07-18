import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery,useMutation } from '@apollo/client';
import { GET_Account_Details } from '../Queries/GET_ACCOUNT_DETAILS';
import { Insert_User_Details } from '../Queries/Mutations/INSERT_USER_DETAILS';


// import Alert from "@material-ui/lab/Alert";
import {Button} from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import CustomizedTextField from '../components/CustomizedTextField;';
import { checkUserAlreadyLoggedIn, checkValidObject, setCurrentUserDetails } from '../utils/reusableFunctions';
import { sendDataToSentry } from '../index';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
      maxWidth: "35rem",
    paddingTop: "3.5rem",
    [theme.breakpoints.down("sm")]: {
      padding: "0 50px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 16px",
      backgroundImage: "none",
    },
  },
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
    fontWeight: "500",
    marginBottom:'1rem',
    padding: "1rem 4rem",
    borderRadius: "8px",
    lineHeight: "24px",
    letterSpacing: "0.02em",

    "&:hover": {
      background: "linear-gradient(127.18deg, #3846FE 0.93%, #6C76FE 98.36%)",
    },
    textTransform: "none",
    // width: "30%",
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
    cursor: 'pointer',
    color: "#3846FE",
    marginTop:'0.5rem',
    '&:hover': {
      textDecoration: 'underline'
    },
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
  const [isSignUp, setIsSignUp] = useState(false)
  const classes = useStyles();

  
   if (checkUserAlreadyLoggedIn()) { 
        history.push('/home')       // if user alraedy logged in than redirecting to home page
  }
  const initialvalues = isSignUp ? { username: "", password: "", email: "" } : { password: "", email: "" }

  const [values, setValues] = useState({...initialvalues});

  const [errors, setErrors] = useState({ ...initialvalues, otherErrors: ""});

  // const [finalValues, setFinalValues] = useState({});

  const [loading, setLoading] = useState(false);

  
  const [addAccount] = useMutation(  // performing mutation to insert user details in DB for signing up the user
    Insert_User_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        const user=res.updatedData
        setCurrentUserDetails(user.userid, user.username, user.email);
        setLoading(false)
      },
      onError: (err) => {
        setErrors({...errors,otherErrors:'Something went wrong'})
        sendDataToSentry({
          name: 'Sign up',
          message: 'User Sign up failed',
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
  );

  // Fetching user details to check user existed in Data base for both sign in and sign up operations
  const [fetchUserDetailAndCheck] = useLazyQuery(   
    GET_Account_Details,
    { 
      onCompleted: (res) => {
        
        const result = res?.connection?.[0];
         const userid = result?.userid;
            const email = result?.email;
            const username = result?.username;
        console.log(res)
          if(userid && username && email) {
            if (isSignUp) {  setErrors({ ...errors, otherErrors: "User already exist" });
            setLoading(false); return false}
            else{
             
              setCurrentUserDetails(userid, username, email);
            
              setLoading(false);
              return true;
           }
            
          } else {
            if (isSignUp) {
            addAccount(
          {
            variables: {
              object: {
                email:  values.email,
                username:  values.username,
                password: values.password
              }
            }
          })
              console.log('done')
              return true;
            }

            setErrors({ ...errors, otherErrors: "Invalid email or password. If you dont have an existed you can create new account" });
            setLoading(false);
            return false;
        }
      },
      onError: (err) => {
        setLoading(false);
        setErrors('something went wrong');
        console.error(err);
        sendDataToSentry({
          name: 'AccountDetails',
          message: 'User Login failed',
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
        return false;
      },
      fetchPolicy: 'network-only',
     }
  );

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
    console.log(123)
    try {
      
    const newErrors = {};
    let newErr;
    for (const [field, value] of Object.entries(values)) {
      newErr = formValidator(field, value, true);
      newErrors[field] = newErr[field];
    }
console.log(values)
    setErrors(newErrors);

      for (const field of Object.keys(newErrors)) {
      console.log(newErrors[field])
        if (newErrors[field]) return false;
      }

console.log('start submitting')
    setLoading(true);
      fetchUserDetailAndCheck({ variables: { email: values.email, password: values.password } })
     
      return true;
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, otherErrors: error });
    }
  };

  const toggleSignUp = () => {
    
    setIsSignUp(!isSignUp);
    setValues({
    username:"",
    password: "",
    email: "",
  });
    setErrors({
    username:"",
    password: "",
    email: "",
    otherErrors: "",
  });
  }


  return (<div className={classes.root}>
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
                value={values.username}
                name="username"
                onInputChange={onInputChange}
                onBlurHandler={onBlurHandler}
                error={!!errors?.username}
                helperText={errors.username}
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
                type='password'
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
                  {isSignUp ? 'Sign up':'Sign in'}
                  </Button>
                  
              )}
              Or
              <div className={classes.toogleSignup} onClick={toggleSignUp }>{isSignUp ?'Already have an account':'Create new account'}</div>
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
    </div>
  )
}
