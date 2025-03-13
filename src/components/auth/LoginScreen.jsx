import { useForm } from "../../hooks/useForm";
import { LogInAction } from "../../actions/auth";
import { LoadingAuth } from "./LoadingAuth";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

//importar las queries y mutations
import { LOGIN } from "../../graphql/mutations/AuthMutations";

import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { notification } from "antd";
import { url_base } from "../../config/app";


const login_mutation = LOGIN;

export const LoginScreen = ({ setShowLoginScreen, history }) => {
  // mutation hook
  const [login] = useMutation(login_mutation);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);
  const [formValues, handleInputChange] = useForm({
    username: "",
    password: "",
  });
  const { username, password } = formValues;
  const [token, setToken] = useState("");

  //ESTO SE EJECUTA A PENAS INICIA EL COMPONENTE, PARA COMPORBAR SI YA ESTA EL TOKEN
  useEffect(() => {
    dispatch(startLoadingAction());

    setTimeout(() => {
            dispatch(finishLoadingAction());
    }, 3000);

  }, [1]);

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
      // img.classList.add("animate-pulse");
    } else {
      // img.classList.remove("animate-pulse");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username !== "" && password !== "") {
      dispatch(startLoadingAction());

      animateBrandImage(true);

      try {
        await login({
          variables: {
            username: username,
            password: password,
          },
        }).then((data) => {
          if (data.data.login !== undefined) {
            const { access_token, user } = data.data.login;
            const { id, name, email, images } = user;

            if (images !== undefined && images.length !== 0) {
              dispatch(
                LogInAction(id, access_token, name, email, images[0].name)
              );
            } else {
              dispatch(LogInAction(id, access_token, name, email, ""));
            }

            localStorage.setItem("_token", access_token);
            // animateBrandImage(false);
          }

          dispatch(finishLoadingAction());

          history.push("/dashboard");
        });
      } catch (error) {
        if (error.message === "invalid_grant")
          // console.log("No se reconoce usuario o contraseña!!");
          openNotification(
            "error",
            "Error!",
            "No se reconoce usuario o contraseña!"
          );

        dispatch(finishLoadingAction());
        animateBrandImage(false);
      }
    } else {
      openNotification("warning", "Atención!", "Llene los campos!");
    }
  };



  return (
    <div>
      <div className=" animate__animated animate__fadeIn bg-gradient-to-r from-indigo-500 to-blue-500 marker:focus:border-2 border-gray-50 w-full max-w-sm p-6 m-auto my-20  rounded-2xl shadow-2xl dark:bg-gray-800">
        {/* <div className="bg-white focus:border-2 border-gray-50 w-full max-w-sm p-6 m-auto my-20  rounded-md shadow-2xl dark:bg-gray-800"> */}
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
                  htmlFor="username"
                  className="block font-semibold text-sm text-white dark:text-gray-200"
                >
                  Usuario
                </label>
                <input
                  placeholder="Escriba su correo"
                  type="text"
                  value={username}
                  name="username"
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm text-white font-semibold dark:text-gray-200"
                  >
                    Contraseña
                  </label>
                  {/* <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:underline">Forget Password?</a> */}
                </div>
                <input
                  placeholder="Escriba su contraseña"
                  type="password"
                  value={password}
                  name="password"
                  onChange={handleInputChange}
                  className=" block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-full dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>
              <br />

              <div className="mt-6">
                <button
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-blue-800 to-blue-600 w-full px-4 py-2 tracking-wide text-white text-lg font-bold transition-colors duration-200 transform rounded-full hover:bg-indigo-600 focus:outline-none focus:bg-blue-600"
                >
                  Entrar
                </button>
              </div>
              <br />
              <div className="flex items-center justify-between mt-4">
                <span className="w-1/3 border-b dark:border-gray-600 lg:w-1/3"></span>

                {token !== "" && token !== null ? (<>

                </>) : (<p
                    onClick={() => {
                      setShowLoginScreen(false);
                    }}
                    className="font-semibold cursor-pointer text-md hover:text-gray-200 text-center text-white dark:text-gray-400"
                >
                  {`Registrarse`}
                </p>)}


                <span className="w-1/3 border-b dark:border-gray-400 lg:w-1/3"></span>
              </div>
            </div>
          ) : (
              <>
                <br/>
                <LoadingAuth/>
                <br/>
              </>
          )}
        </form>
      </div>
    </div>
  );
};
