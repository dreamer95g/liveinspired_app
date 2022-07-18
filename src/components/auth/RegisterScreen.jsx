import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";

import { useForm } from "../../hooks/useForm";
//import { setErrorAction, removeErrorAction } from "../../actions/ui";
//import { startRegisterWithEmailPasswordName } from "../../actions/auth";

export const RegisterScreen = () => {
  //const dispatch = useDispatch();
  //const { msgError } = useSelector((state) => state.ui);

  const [formValues, handleInputChange] = useForm({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formValues;

  const handleRegister = (e) => {
    e.preventDefault();

    if (isFormValid()) {
      //dispatch(startRegisterWithEmailPasswordName(email, password, name));
    }
  };

  const isFormValid = () => {
    if (name.trim().length === 0) {
      //dispatch(setErrorAction("Name is required"));
      return false;
    } else if (!validator.isEmail(email)) {
      // dispatch(setErrorAction("Email is not valid"));
      return false;
    } else if (password !== password2 || password.length < 5) {
      // dispatch(
      //   setErrorAction(
      //     "Password should be at least 6 characters and match each other"
      //   )
      // );
      return false;
    }

    // dispatch(removeErrorAction());
    return true;
  };

  return <></>;
};
