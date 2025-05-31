import React, { useState, useEffect } from "react";
import { Modal, Button, Input, notification } from "antd";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { ME } from "../../graphql/queries/AuthQueries";
import { DELETE_IMAGE } from "../../graphql/mutations/ImagesMutations";
import { STORE_IMAGE_B64 } from "../../graphql/mutations/ImagesMutations";
import { ProfilePhotoInput } from "./ProfilePhotoInput";
import { UPDATE_USER } from "../../graphql/mutations/AuthMutations";
import { UPDATE_IMAGE_USER } from "../../graphql/mutations/AuthMutations";

import { CHANGE_PASS } from "../../graphql/mutations/AuthMutations";
import { apollo_client } from "../../config/apollo";
import { LogInAction } from "../../actions/auth";
import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { useDispatch, useSelector } from "react-redux";
import Password from "antd/lib/input/Password";
import { KnownTypeNamesRule } from "graphql";
export const ProfileModal = ({
  showProfileModal,
  setShowProfileModal,
  setAvatar,
  setProfileName,
}) => {
  const dispatch = useDispatch();

  //DECLARAR LAS MUTACIONES
  const [deleteImage] = useMutation(DELETE_IMAGE);
  const [storeImageB64] = useMutation(STORE_IMAGE_B64);
  const [updateUser] = useMutation(UPDATE_USER);
  const [updateImageUser, { error: errorInUpdateImagesUser }] =
    useMutation(UPDATE_IMAGE_USER);
  const [changePass, { error: errorInChangePass }] = useMutation(CHANGE_PASS);

  //QUERY QUE OBTIENE EL USUARIO ACTUAL
  const { data: me } = useQuery(ME);

  const { loading } = useSelector((state) => state.ui);

  //ATRIBUTOS DEL COMPONENTE
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState(`Perfil de Usuario`);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState("");
  const [photo, setPhoto] = useState("");

  const [selectedImage, setSelectedImage] = useState();
  const [images, setImages] = useState([]);

  const [old_password, setOldPassword] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [action, setAction] = useState("view");
  const [showPasswordsFields, setShowPasswordsFields] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setShowProfileModal(false);
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description,placement) => {
    notification[type]({
      message: message,
      description: description,
      placement:placement
    });
  };

  // HANDLERS

  const handleCancel = () => {
    setIsModalVisible(false);
    setShowProfileModal(false);
  };

  const handleInputNameChange = ({ target }) => {
    setName(target.value);
  };

  const handleInputOldPassChange = ({ target }) => {
    setOldPassword(target.value);
  };

  const handleInputPassChange = ({ target }) => {
    setPassword(target.value);
  };

  const handleInputPassConfirmChange = ({ target }) => {
    setPasswordConfirmation(target.value);
  };

  // METODOS

  const refetch = async () => {
    await apollo_client.refetchQueries({
      include: [ME],
    });
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const modifyUser = async () => {
    dispatch(startLoadingAction());
    let hasError = false;
    //PASOS
    //SI LA FOTO NO ESTA VACIA BORRAR LA IMAGEN VIEJA
    //GUARDO LA IMAGEN NUEVA Y COJO EL ID
    //UPDATE USUARIO CON LA NUEVA IMAGEN Y CON EL NOMBRE
    //SI LOS CAMPOS DE LA CONTRASENNA ESTAN LLENOS ACTUALIZAR CONTRASENNA

    let idImageToUpdate = "";

    try {
      try {
        if (showPasswordsFields === true) {
          if (
            old_password !== "" &&
            password !== "" &&
            password_confirmation !== ""
          ) {
            if (password === password_confirmation) {
              await changePass({
                variables: {
                  old_password: old_password,
                  password: password,
                  password_confirmation: password_confirmation,
                },
              }).then((data) => {
                const { status, message } = data.data.updatePassword;
                // openNotification("success", status, message);
              });
            } else {
              hasError = true;
              openNotification(
                "warning",
                "Atencion",
                "No coinciden las contraseñas!!",
                  "top"
              );
            }
          } else {
            openNotification(
              "warning",
              "Atención",
              "Debe llenar las campos de las contraseñas!",
                "top"
            );
            hasError = true;
          }
        }
      } catch (error) {
        console.log(error);
        hasError = true;
        openNotification(
          "error",
          "Error",
          "La actual contraseña no es válida!!",
            "top"
        );
      }

      if (hasError === false && photo !== "") {
        if (oldImage !== null && oldImage !== "") {
          const oldIdInt = parseInt(oldImage !== "" && oldImage);

          await deleteImage({
            variables: {
              id: oldIdInt,
            },
          });
        }

        const imgb64 = await getBase64(photo);

        await storeImageB64({
          variables: {
            name: imgb64,
          },
        }).then((data) => {
          // console.table(data);
          if (data !== null) {
            const { id } = data.data.storeImage;
            idImageToUpdate = parseInt(id);
          }
        });
      }

      if (
        hasError === false &&
        idImageToUpdate !== "" &&
        idImageToUpdate !== null
      ) {
        await updateImageUser({
          variables: {
            id: userId,
            images: [idImageToUpdate],
          },
        }).then((data) => {
          const { images: photos } = data.data.updateUser;

          refetch();

          const token = localStorage.getItem("_token");

          if (photos !== undefined && photos.length !== 0) {
            //MODIFICAR EL AVATAR DE LA CLASE PADRE
            //PQ CAMBIO
            setAvatar(photos[0].name);

            // dispatch(
            //   LogInAction(token, name, email, roles[0].name, photos[0].name)
            // );
          }
        });
      }

      if (hasError === false) {
        if (name !== "") {
          await updateUser({
            variables: {
              id: userId,
              name: name,
            },
          }).then(async (data) => {
            refetch();
            setProfileName(name);
          });
        } else {
          hasError = true;
          dispatch(finishLoadingAction());
          openNotification("warning", "Atención", "Debe llenar el nombre!","top");
        }
      }
    } catch (error) {
      console.log(error);
      openNotification("error", "Error", error.message,"top");
    }

    if (hasError === false) {
      openNotification(
        "success",
        "Usuario Modificado",
        "Su usuario fue modificado correctamente",
          "top"
      );
      setAction("view");
    }

    dispatch(finishLoadingAction());
  };

  useEffect(() => {
    if (showProfileModal) {
      showModal();
    }
    refetch();
  }, [showProfileModal]);

  useEffect(() => {
    if (errorInChangePass !== undefined) {
    }
  }, [errorInChangePass]);

  useEffect(() => {
    setOldPassword("");
    setPassword("");
    setPasswordConfirmation("");
  }, [action]);

  useEffect(() => {
    if (me !== undefined && me !== null) {
      const { id, name, email, images, roles } = me.me;
      setUserId(id);
      setName(name);
      setEmail(email);

      if (roles !== undefined && roles !== null && roles.length !== 0) {
        setRoles(roles);
      }

      if (images !== null && images !== undefined && images.length !== 0) {
        const { id } = images[0];

        setOldImage(id);

        setImages(images);
      }
    }
  }, [me]);

  return (
    <>
      <Modal
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <div className="my-5 flex content-center w-full ">
            {loading === false ? (
              <div className="flex mx-auto">
                {action === "view" && (
                  <button
                    onClick={() => {
                      setAction("update");
                      setShowPasswordsFields(false);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-500 flex  w-full mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-green-400 text-white"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="mx-1">Editar</span>
                  </button>
                )}
                {action === "update" && (
                  <button
                    onClick={modifyUser}
                    className="bg-gradient-to-r from-green-600 to-green-500 flex  w-full mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-green-400 text-white"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span className="mx-1">Editar</span>
                  </button>
                )}

                {action === "view" && (
                  <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-red-600 to-red-500 flex w-full mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-red-400 text-white"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mx-1">Cerrar</span>
                  </button>
                )}

                {action === "update" && (
                  <button
                    onClick={() => {
                      setShowPasswordsFields(!showPasswordsFields);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 flex w-full mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-indigo-400 text-white"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>

                    <span className="mx-1"> Contraseña</span>
                  </button>
                )}

                {action === "update" && (
                  <button
                    onClick={() => {
                      setAction("view");
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-500 flex w-full mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent focus:outline-none hover:bg-red-400 text-white"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="mx-1">Cancelar</span>
                  </button>
                )}
              </div>
            ) : (
              <Loading className="my-10" />
            )}
          </div>,
        ]}
        style={{ textAlign: "center" }}
      >
        {action === "view" && (
          <div>
            {images.length !== 0 && (
              <div>
                <img
                  className="w-32 h-32 mx-auto content-center my-auto rounded-full "
                  src={images[0].name}
                  alt="brand"
                />
                <hr className="my-4 "></hr>
              </div>
            )}

            {
              <>
                <div className="flex content-center ">
                  <div className="flex mx-auto cursor-default">
                    <h1 className=" text-md my-1 mx-1 text-center">Nombre: </h1>
                    <h1 className="text-blue-700 text-md my-1 mx-1 text-center">{`${name}`}</h1>
                  </div>
                </div>
                <hr className="my-4 mx-auto text-center"></hr>
                <div className="flex content-center ">
                  <div className="flex mx-auto cursor-default">
                    <h1 className=" text-md my-1 mx-1 text-center">Email: </h1>
                    <h1 className="text-blue-700 text-md my-1 mx-1 text-center">{`${email}`}</h1>
                  </div>
                </div>
              </>
            }
          </div>
        )}

        {action === "update" && loading === false && (
          <div>
            <ProfilePhotoInput
              setPhoto={setPhoto}
              action={action}
              selectedImage={selectedImage}
            />
            <hr className="my-4 mx-auto text-center"></hr>

            <div className="my-5  ">
              <div className="my-8 ">
                <label className="text-md mx-4">Nombre:</label>
                <br />
                <Input
                  value={name}
                  onChange={handleInputNameChange}
                  placeholder="Nombre"
                  style={{ width: "300px", borderRadius: "10px" }}
                />
              </div>

              <hr className="my-4 mx-auto text-center"></hr>

              {showPasswordsFields === true && loading === false && (
                <div>
                  <div className="my-8 ">
                    <label className="text-md mx-4">Contraseña anterior:</label>
                    <br />
                    <Input.Password
                      value={old_password}
                      onChange={handleInputOldPassChange}
                      placeholder="Contraseña anterior"
                      style={{ width: "300px", borderRadius: "10px" }}
                    />
                  </div>
                  <div className="my-8 ">
                    <label className="text-md mx-4">Nueva Contraseña:</label>
                    <br />
                    <Input.Password
                      value={password}
                      onChange={handleInputPassChange}
                      placeholder="Nueva contraseña"
                      style={{ width: "300px", borderRadius: "10px" }}
                    />
                  </div>
                  <div className="my-8 ">
                    <label className="text-md mx-4">
                      Confirmar Contraseña:
                    </label>
                    <br />
                    <Input.Password
                      value={password_confirmation}
                      onChange={handleInputPassConfirmChange}
                      placeholder="Confirmar contraseña"
                      style={{ width: "300px", borderRadius: "10px" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
