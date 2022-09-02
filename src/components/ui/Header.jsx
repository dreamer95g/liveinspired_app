import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sideVarChangeStateAction } from "../../actions/ui";
import { LogoutAction } from "../../actions/auth";
import { url_base } from "../../config/app";
import { ProfileHelpModal } from "../profile/ProfileHelpModal";
import { ProfileModal } from "../profile/ProfileModal";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutations/AuthMutations";
import { ConfigModal } from "../config/ConfigModal";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

export const Header = ({ history }) => {
  const [logout] = useMutation(LOGOUT);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const { sideBarSate } = useSelector((state) => state.ui);

  const { email } = useSelector((state) => state.auth);
  const { name } = useSelector((state) => state.auth);
  const { photo } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState();
  const [profileName, setProfileName] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    setAvatar(photo);
    setProfileName(name);
  }, []);

  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(startLoadingAction());
    await logout().then((data) => {
      //   console.log(data);
    });
    dispatch(finishLoadingAction());
    dispatch(LogoutAction());
    localStorage.removeItem("_token");
  };

  const handleDropDownVisibility = () => {
    setDropDownOpen(!dropDownOpen);
    // setAvatar(photo);
  };

  const sideBarChangeStatus = () => {
    //e.preventDefault();
    dispatch(sideVarChangeStateAction(true));
  };

  const helpModalVisible = () => {
    // alert(showHelpModal);
    setShowHelpModal(true);
  };

  const profileModalVisible = () => {
    // alert(showHelpModal);
    setShowProfileModal(true);
    // setAvatar(photo);
  };

  const configModalVisible = () => {
    // alert(showHelpModal);
    setShowConfigModal(true);
    // setAvatar(photo);
  };

  // const hideDropDown = () => {
  //   const dropdown = document.getElementById("dropdown");

  //   dropdown.classList.remove("animate__fadeIn");

  //   dropdown.classList.add("animate__fadeOut");

  //   setDropDownOpen(false);
  // };

  return (
    <>
      <nav className=" dark:bg-gray-800 border-b-4 border-gray-200 bg-gradient-to-r from-indigo-500 to-blue-500">
        <div className="container px-35 py-4 mx-auto ">
          <div className="flex md:justify-between">
            <div className="flex float-left w-12" onClick={sideBarChangeStatus}>
              <div className="flex ">
                <button
                  type="button"
                  className=" font-bold text-white hover:text-gray-200 dark:hover:text-gray-400 focus:outline-none  dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  <svg
                    className="mx-1 h-7 w-7 "
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6H20M4 12H20M4 18H11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex  float-right ml-auto ">
              <div className="flex ">
                <div className="relative ">
                  <div
                    onClick={handleDropDownVisibility}
                    className="bg-transparent relative z-10 flex items-center p-2 text-sm text-gray-600 border border-transparent rounded-md focus:border-blue-500 focus:ring-opacity-40 dark:focus:ring-opacity-40 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring dark:text-white dark:bg-gray-800 focus:outline-none cursor-pointer"
                  >
                    <button className=" flex mx-auto my-auto   font-semibold outline-none ">
                      {avatar !== "" ? (
                        <img
                          className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                          src={avatar}
                          alt="avatar"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className=" h-6 w-6 text-gray-100 hover:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {/* {email !== undefined ? email : ""} */}
                    </button>
                  </div>

                  {dropDownOpen && (
                    <div
                      onMouseLeave={handleDropDownVisibility}
                      onClick={handleDropDownVisibility}
                      className="bg-gray-100 border-1 border-gray-200  animate__animated animate__fadeIn  absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden rounded-md shadow-xl dark:bg-gray-800"
                    >
                      <a className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:text-blue-600 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white">
                        {avatar !== "" ? (
                          <img
                            className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                            src={avatar}
                            alt="avatar"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-1 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}

                        <div className="mx-1 ">
                          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            {profileName !== undefined ? profileName : "User"}
                          </h1>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {email !== undefined ? email : ""}
                          </p>
                        </div>
                      </a>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <a
                        onClick={profileModalVisible}
                        href="#"
                        className="border-l-4 border-transparent hover:border-blue-500 hover:text-blue-600  flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          className="w-5 h-5 mx-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M6.34315 16.3431C4.84285 17.8434 4 19.8783 4 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16C13.5913 16 15.1174 16.6321 16.2426 17.7574C17.3679 18.8826 18 20.4087 18 22H20C20 19.8783 19.1571 17.8434 17.6569 16.3431C16.1566 14.8429 14.1217 14 12 14C9.87827 14 7.84344 14.8429 6.34315 16.3431Z"
                            fill="currentColor"
                          ></path>
                        </svg>

                        <span className="mx-1 ">Ver Perfil</span>
                      </a>

                      <a
                        onClick={helpModalVisible}
                        href="#"
                        className="border-l-4 border-transparent hover:border-blue-500 hover:text-blue-600 flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          className="w-5 h-5 mx-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 22C6.47967 21.9939 2.00606 17.5203 2 12V11.8C2.10993 6.30452 6.63459 1.92794 12.1307 2.00087C17.6268 2.07379 22.0337 6.56887 21.9978 12.0653C21.9619 17.5618 17.4966 21.9989 12 22ZM11.984 20H12C16.4167 19.9956 19.9942 16.4127 19.992 11.996C19.9898 7.57928 16.4087 3.99999 11.992 3.99999C7.57528 3.99999 3.99421 7.57928 3.992 11.996C3.98979 16.4127 7.56729 19.9956 11.984 20ZM13 18H11V16H13V18ZM13 15H11C10.9684 13.6977 11.6461 12.4808 12.77 11.822C13.43 11.316 14 10.88 14 9.99999C14 8.89542 13.1046 7.99999 12 7.99999C10.8954 7.99999 10 8.89542 10 9.99999H8V9.90999C8.01608 8.48093 8.79333 7.16899 10.039 6.46839C11.2846 5.76778 12.8094 5.78493 14.039 6.51339C15.2685 7.24184 16.0161 8.57093 16 9.99999C15.9284 11.079 15.3497 12.0602 14.44 12.645C13.6177 13.1612 13.0847 14.0328 13 15Z"
                            fill="currentColor"
                          ></path>
                        </svg>

                        <span className="mx-1">Ayuda</span>
                      </a>

                      <a
                        onClick={configModalVisible}
                        href="#"
                        className="border-l-4 border-transparent hover:border-blue-500 hover:text-blue-600 flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>

                        <span className="mx-1">Backup</span>
                      </a>

                      <hr className="border-gray-200 dark:border-gray-700 " />
                      <a
                        href="#"
                        onClick={handleLogout}
                        className="border-l-4 border-transparent hover:border-blue-500 hover:text-blue-600 flex items-center p-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        <svg
                          className="w-5 h-5 mx-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 21H10C8.89543 21 8 20.1046 8 19V15H10V19H19V5H10V9H8V5C8 3.89543 8.89543 3 10 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM12 16V13H3V11H12V8L17 12L12 16Z"
                            fill="currentColor"
                          ></path>
                        </svg>

                        <span className="mx-1">Salir</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ProfileHelpModal
              showHelpModal={showHelpModal}
              setShowHelpModal={setShowHelpModal}
            />
            <ProfileModal
              showProfileModal={showProfileModal}
              setShowProfileModal={setShowProfileModal}
              setAvatar={setAvatar}
              setProfileName={setProfileName}
            />

            <ConfigModal
              showConfigModal={showConfigModal}
              setShowConfigModal={setShowConfigModal}
              history={history}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </nav>
    </>
  );
};
