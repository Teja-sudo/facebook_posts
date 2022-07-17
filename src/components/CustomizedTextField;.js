/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React from "react";
import { FormHelperText, FormControl, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import { ThemeProvider } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  formControl: {
    width: "100%",
  },

  inputLabel: {
    color: "#677489",
    fontSize: "14px",
  },

  inputLabelFocused: { color: "#3846FE !important" },

  textField: {
    background: "#F2F5F9",
    fontSize: "14px !important",
    "&$textFieldFocused $notchedOutline": {
      border: "2px solid #3846FE",
    },
    "&:hover $notchedOutline": {
      border: "1px solid #3846FE",
    },
  },
  textFieldError: {
    background: "#F2F5F9",
    "&$textFieldFocused $notchedOutline": {
      border: "2px solid #f44336",
    },
    "&:hover $notchedOutline": {
      border: "1px solid #f44336",
    },
  },
  input: {
    fontSize: "14px !important",
  },

  textFieldFocused: { background: "#FFFFFF", fontSize: "14px !important" },

  notchedOutline: {
    borderWidth: "1px",
    border: "1px solid #E3E8EF",
    borderRadius: "8px",
  },
  errorText: {
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "24px",
  },
}));

const CustomizedTextField = ({
  name,
  type = "text",
  placeholder = "Enter ",
  label="",
  helperText = "",
  error = false,
  value,
  onInputChange,
  onBlurHandler,

  required = false,
}) => {
  const classes = useStyles();
  // const theme = createTheme({
  //   typography: {
  //       htmlFontSize: 2,
  // },
  //      palette: {
  //         primary: {
  //            main: "#3846FE",

  //         },
  //         error: {
  //           main: "#f44336",
  //         },
  //   },
  //    info: {
  //            main: "#3846FE",

  //         },

  //   });
  return (
    <>
      <FormControl
        className={classes.formControl}
        required={required}
        error={error}
      >
        {/* <ThemeProvider theme={theme}> */}
        <TextField
          InputLabelProps={{
            classes: {
              root: classes.inputLabel,
              focused: helperText ? null : classes.inputLabelFocused,
            },
          }}
          InputProps={{
            classes: {
              root: helperText ? classes.textFieldError : classes.textField,
              input: classes.input,
              focused: classes.textFieldFocused,
              notchedOutline: classes.notchedOutline,
            },
            style: { fontSize: "14px" },
          }}
          variant="outlined"
          label={label}
          id={name}
          fullWidth
          name={name}
          type={type}
          value={value}
          placeholder={placeholder+label}
          onChange={(e) => {
            onInputChange(e);
          }}
          onBlur={(e) => {
            onBlurHandler(e);
          }}
          error={error}
        />
        {/* </ThemeProvider> */}
        {error && (
          <FormHelperText className={classes.errorText} id={name}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default CustomizedTextField;
