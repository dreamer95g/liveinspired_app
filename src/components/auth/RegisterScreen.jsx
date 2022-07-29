import { useForm } from "../../hooks/useForm";
import { LogInAction } from "../../actions/auth";
import { LoadingAuth } from "./LoadingAuth";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

//importar las queries y mutations
import { REGISTER } from "../../graphql/mutations/AuthMutations";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { notification } from "antd";
import { url_base } from "../../config/app";

import validator from "validator";

const register_mutation = REGISTER;

export const RegisterScreen = ({ setShowLoginScreen, history }) => {
  // mutation hook
  const [register] = useMutation(register_mutation);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const [formValues, handleInputChange] = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { name, email, password, password_confirmation } = formValues;

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const animateBrandImage = (stauts) => {
    const img = document.getElementById("image");

    if (stauts) {
      img.classList.add("animate-pulse");
    } else {
      img.classList.remove("animate-pulse");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(name)) {
      openNotification("warning", "Atencion", "Llene el nombre!");
      isValid = false;
    }

    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      openNotification("warning", "Atencion", "Entre un correo valido!");
      isValid = false;
    }

    if (validator.isEmpty(password || password_confirmation)) {
      openNotification("warning", "Atencion", "Llene la contraseña!");
      isValid = false;
    }

    if (password !== password_confirmation) {
      openNotification("warning", "Atencion", "Las contraseñas no coinciden!");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let valid = validateForm();

    if (valid === true) {
      dispatch(startLoadingAction());

      //   animateBrandImage(true);

      try {
        await register({
          variables: {
            name: name,
            email: email,
            password: password,
            password_confirmation: password_confirmation,
          },
        }).then((data) => {
          if (data.data !== undefined) {
            const { status } = data.data.register;

            if (status === "SUCCESS") {
              dispatch(finishLoadingAction());
              openNotification(
                "success",
                "Usuario",
                "Usuario registrado de forma satisfctoria!"
              );
              setShowLoginScreen(true);
            }
          }
        });
      } catch (error) {
        console.log(error);
        if (error.message === "Validation failed for the field [register].")
          // console.log("No se reconoce usuario o contraseña!!");
          openNotification(
            "error",
            "Error!",
            "Ya existe un usuario con ese correo o la contraseña es de menos de 8 caracteres!"
          );

        dispatch(finishLoadingAction());
      }
    }
  };

  return (
    <div>
      {/* <div className="bg-gradient-to-r from-indigo-700 to-indigo-400 focus:border-2 border-gray-50 w-full max-w-sm p-6 m-auto my-20  rounded-md shadow-lg dark:bg-gray-800"> */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-400 focus:border-2 border-gray-50 w-full max-w-sm p-6 m-auto my-20  rounded-md shadow-2xl dark:bg-gray-800">
        <img
          id="image"
          src={`${url_base}assets/images/logo.png`}
          // src="/src/assets/logo.png"
          className="w-40 h-40 mx-auto content-center my-auto"
        />

        <form className="mt-6">
          {loading === false ? (
            <div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-white dark:text-gray-200"
                >
                  Nombre
                </label>
                <input
                  placeholder="Nombre del usuario"
                  type="text"
                  value={name}
                  name="name"
                  onChange={handleInputChange}
                  className="my-6 block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white dark:text-gray-200"
                >
                  Correo
                </label>
                <input
                  placeholder="Correo"
                  type="email"
                  value={email}
                  name="email"
                  onChange={handleInputChange}
                  className="my-6 block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white  dark:text-gray-200"
                  >
                    Contraseña
                  </label>
                  {/* <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:underline">Forget Password?</a> */}
                </div>
                <input
                  placeholder="Contraseña (8 caracteres o más )"
                  type="password"
                  value={password}
                  name="password"
                  onChange={handleInputChange}
                  className="my-6 block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-semibold text-white  dark:text-gray-200"
                  >
                    Repita la Contraseña
                  </label>
                  {/* <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:underline">Forget Password?</a> */}
                </div>
                <input
                  placeholder="Debe ser igual a la anterior"
                  type="password"
                  value={password_confirmation}
                  name="password_confirmation"
                  onChange={handleInputChange}
                  className="my-6 block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <br />
              <div className="">
                <button
                  onClick={handleRegister}
                  className="bg-gradient-to-r from-indigo-700 to-indigo-500 w-full px-4 py-2 tracking-wide text-white text-lg font-bold transition-colors duration-200 transform rounded-full hover:bg-indigo-600 focus:outline-none focus:bg-blue-600"
                >
                  Registrarse
                </button>
              </div>
              <br />
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/3 border-b dark:border-gray-600 lg:w-1/3"></span>
                <p
                  onClick={() => {
                    setShowLoginScreen(true);
                  }}
                  className="font-semibold cursor-pointer text-md hover:text-gray-400 text-center text-white dark:text-gray-400"
                >
                  {`Regresar`}
                </p>
                <span className="w-1/3 border-b dark:border-gray-400 lg:w-1/3"></span>
              </div>
            </div>
          ) : (
            <>
              <LoadingAuth />
              <br />
            </>
          )}
        </form>
      </div>
    </div>
  );
};
