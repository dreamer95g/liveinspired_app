import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";
import { url_base } from "../../config/app";
import { BACKUP_DATA } from "../../graphql/mutations/BackupData";
import { RESTORE_DATA } from "../../graphql/mutations/BackupData";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutations/AuthMutations";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Redirect } from "react-router-dom";

export const ConfigModal = ({
  showConfigModal,
  setShowConfigModal,
  history,
  handleLogout,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [directory, setDirectory] = useState("");

  const [backupData] = useMutation(BACKUP_DATA);
  const [restoreData] = useMutation(RESTORE_DATA);
  const { loading } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [goToLogin, setGoToLogin] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowConfigModal(false);
    setDirectory("");
  };

  const backup = async () => {
    let dir = directory;

    if (dir !== "") {
      dispatch(startLoadingAction());
      await backupData({
        variables: {
          dir: dir,
        },
      }).then((data) => {
        const { result } =
          data.data.backupData !== undefined ? data.data.backupData : "";

        if (result === "0") {
          openNotification(
            "success",
            "Backup",
            "Backup realizado de forma satisfactoria!"
          );
          handleOk();
          dispatch(finishLoadingAction());
        } else {
          openNotification(
            "error",
            "Error",
            "Ocurrió algún error, revise la ruta del directorio o backup!"
          );
          dispatch(finishLoadingAction());
        }
      });
    } else {
      openNotification(
        "warning",
        "Atención",
        "Llene el directorio o backup SQL!"
      );
    }
  };

  const restore = async () => {
    let backup = directory;

    if (backup !== "") {
      dispatch(startLoadingAction());
      await restoreData({
        variables: {
          backup: backup,
        },
      }).then((data) => {
        const { result } =
          data.data.restoreData !== undefined ? data.data.restoreData : "";

        if (result === "0") {
          openNotification(
            "success",
            "Respaldo",
            "Datos restaurados de forma satisfactoria!"
          );
          handleOk();

          dispatch(finishLoadingAction());
          history.push("/auth/login");
          handleLogout();
        } else {
          openNotification(
            "error",
            "Error",
            "Ocurrió algún error, revise la ruta del directorio o backup!"
          );
          dispatch(finishLoadingAction());
        }
      });
    } else {
      openNotification(
        "warning",
        "Atención",
        "Llene el directorio o backup SQL!"
      );
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowConfigModal(false);
  };

  const handleInputDirectoryChange = ({ target }) => {
    setDirectory(target.value);
  };

  useEffect(() => {
    if (showConfigModal) {
      showModal();
    }
  }, [showConfigModal]);

  return (
    <>
      <Modal
        title={`Backup o Restauración de los Datos`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div className="flex content-center text-center ">
            {!loading && (
              <div className="mx-auto flex text-center ">
                <button
                  onClick={backup}
                  className="bg-gradient-to-r from-blue-700 to-blue-400 flex w-44 mx-auto px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-blue-400 text-white"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-2"
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
                </button>

                <button
                  onClick={restore}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-400  flex w-44 mx-auto px-4 py-2 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-indigo-400 text-white"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  <span className="mx-1">Restaurar</span>
                </button>
              </div>
            )}
          </div>,
        ]}
        style={{ textAlign: "center" }}
      >
        <div className="my-8 ">
          {!loading ? (
            <>
              <label className="font-semibold mx-4 ">
                Directorio ( \ ) o Backup SQL:
              </label>
              <br />
              <Input
                value={directory}
                onChange={handleInputDirectoryChange}
                placeholder="Ej. C:\Users\gabry\Desktop\"
                style={{ width: "450px", borderRadius: "10px" }}
              />
            </>
          ) : (
            <div className="flex content-center">
              <Loading className="my-8" />
            </div>
          )}
        </div>
        <div>{/* <hr className="my-4 "></hr> */}</div>
      </Modal>
    </>
  );
};
