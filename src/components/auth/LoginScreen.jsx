import { useForm } from "../../hooks/useForm";
import { LogInAction } from "../../actions/auth";
import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

//importar las queries y mutations
import { LOGIN } from "../../graphql/mutations/AuthMutations";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { notification } from "antd";
import { url_base } from "../../config/app";

const login_mutation = LOGIN;

export const LoginScreen = ({ history }) => {
  // mutation hook
  const [login] = useMutation(login_mutation);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const [formValues, handleInputChange] = useForm({
    username: "gabry95g@gmail.com",
    password: "xgabry",
  });

  const { username, password } = formValues;

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
            const { name, email, images } = user;

            if (images !== undefined && images.length !== 0) {
              dispatch(LogInAction(access_token, name, email, images[0].name));
            } else {
              dispatch(LogInAction(access_token, name, email, ""));
            }

            localStorage.setItem("_token", access_token);
            animateBrandImage(false);
          }

          dispatch(finishLoadingAction());

          history.push("/dashboard");
        });
      } catch (error) {
        if (error.message === "invalid_grant")
          console.log("No se reconoce usuario y pass!!");
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
      <div className=" border-2 border-gray-50 w-full max-w-sm p-6 m-auto my-20 bg-white rounded-md shadow-lg dark:bg-gray-800">
        <img
          id="image"
          // src={`../../assets/images/inspired1`}
          src="/src/assets/images/logo.png"
          className="w-40 h-40 mx-auto content-center my-auto"
        />

        <form className="mt-6">
          {loading === false ? (
            <div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-gray-800 dark:text-gray-200"
                >
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  name="username"
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-800 dark:text-gray-200"
                  >
                    Contraseña
                  </label>
                  {/* <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:underline">Forget Password?</a> */}
                </div>
                <input
                  type="password"
                  value={password}
                  name="password"
                  onChange={handleInputChange}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 tracking-wide text-white text-lg font-bold transition-colors duration-200 transform bg-indigo-600 rounded-full hover:bg-indigo-400 focus:outline-none focus:bg-gray-400"
                >
                  Login
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
                <p
                  href="#"
                  className="cursor-pointer text-xs hover:text-blue-700 text-center text-gray-600 uppercase dark:text-gray-400"
                >
                  {`Live Inspired ${new Date().getFullYear()}`}
                </p>
                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </form>
      </div>
    </div>
  );
};
