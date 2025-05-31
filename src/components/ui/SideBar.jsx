import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sideVarChangeStateAction } from "../../actions/ui";
import { Link } from "react-router-dom";
import { url_base } from "../../config/app";

export const SideBar = () => {
  const dispatch = useDispatch();
  const { sideBarSate } = useSelector((state) => state.ui);

  const { email } = useSelector((state) => state.auth);
  const { name } = useSelector((state) => state.auth);
  const { photo } = useSelector((state) => state.auth);
  const [image, setImage] = useState();

  // const [sideBarSate, setSideBarSate] = useState(false);

  const sideBarChangeStatus = () => {
    //e.preventDefault();
    dispatch(sideVarChangeStateAction(!sideBarSate));

    //setSideBarSate(!sideBarSate);
  };

  useEffect(() => {
    const url = url_base;
    // setImage(`${url}assets/${photo}`);
    setImage(photo);
    //console.log(image);
  }, []);

  const hiddeSideBar = () => {
    dispatch(sideVarChangeStateAction(false));
  };

  const showAndHideSideBar = (status) => {
    const sidebar = document.getElementById("sidebar");

    if (status) {
      sidebar.classList.remove("-translate-x-full");
      sidebar.classList.remove("ease-in");

      sidebar.classList.add("translate-x-0");
      sidebar.classList.add("ease-out");
      // sidebar.setAttribute("hidden", "");
    } else {
      sidebar.classList.remove("translate-x-0");
      sidebar.classList.remove("ease-out");

      sidebar.classList.add("-translate-x-full");
      sidebar.classList.add("ease-in");
      // sidebar.setAttribute("hidden", true);
    }
  };

  useEffect(() => {
    //alert(sideBarSate);
    showAndHideSideBar(sideBarSate);
  }, [sideBarSate]);

  return (
    <>
      {
        <div
          id="sidebar"
          className="bg-gray-100 border-r border-gray-300 fixed z-30 inset-y-0 left-0 w-64 transition duration-700 transform flex flex-col h-screen py-8   dark:bg-gray-800 dark:border-gray-600 overflow-y-auto overflow-x-hidden rounded-lg "
          onClick={sideBarChangeStatus}
          onMouseLeave={hiddeSideBar}
        >
          <div className="flex flex-col items-center mt-6 -mx-2">
            {
              <div>
                <img
                  className="w-32 h-32 mx-auto content-center my-auto rounded-full "
                  src={`${url_base}assets/images/logo.png`}
                  alt="brand"
                />
                <hr className="my-4 "></hr>
              </div>
            }
          </div>

          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav>
              <Link
                to="/dashboard"
                className="flex items-center px-4 border-l-4 border-transparent hover:border-blue-500 hover:bg-gray-200 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400  dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>

                <span className="mx-4 font-medium">Inicio</span>
              </Link>
              <Link
                to="/dashboard/search"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <span className="mx-4 font-medium">Búsquedas</span>
              </Link>
              <Link
                to="/dashboard/phrases"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>

                <span className="mx-4 font-medium">Frases</span>
              </Link>

              <Link
                className="border-l-4 border-transparent hover:border-blue-500 flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-700"
                to="/dashboard/notes"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>

                <span className="mx-4 font-medium">Notas</span>
              </Link>

              <Link
                to="/dashboard/tags"
                className="flex items-center border-l-4 border-transparent hover:border-blue-500 px-4 py-2 mt-5 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-blue-700"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>

                <span className="mx-4 font-medium">Palabras Clave</span>
              </Link>
            </nav>
          </div>
        </div>
      }
    </>
  );
};
