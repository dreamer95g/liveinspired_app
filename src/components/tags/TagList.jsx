import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { TAGS } from "../../graphql/queries/TagsQueries";
import {
  UPDATE_TAG,
  DELETE_TAG,
  DELETE_TAGS,
  CREATE_TAG,
} from "../../graphql/mutations/TagsMutations";

import { TagTable } from "./TagTable";

import { apollo_client } from "../../config/apollo";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { TagModal } from "./TagModal";
import { data } from "autoprefixer";

export const TagList = ({ history }) => {
  const { id: user_id } = useSelector((state) => state.auth);

  const [tags, setTags] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [tagName, setTagName] = useState("");

  const [action, setAction] = useState("");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const { data: tagsFromServer } = useQuery(TAGS, {
    variables: { user_id: user_id },
  });

  const [updateTag] = useMutation(UPDATE_TAG);
  const [deleteTag] = useMutation(DELETE_TAG);
  const [deleteTags] = useMutation(DELETE_TAGS);
  const [createTag] = useMutation(CREATE_TAG);

  const refetchTags = async () => {
    await apollo_client.refetchQueries({
      include: [TAGS],
    });
    dispatch(finishLoadingAction());
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const fillTagsData = (tagsFromServer) => {
    // console.log(tagsFromServer);

    setTags([]);

    tagsFromServer.forEach((tag) => {
      //const { tags } = contact;

      // console.table(tag);

      const record = {
        key: tag.id,
        name: tag.name,
      };

      setTags((tags) => [...tags, record]);
    });
  };

  const saveTag = async (name) => {
    if (name !== "") {
      try {
        await createTag({
          variables: {
            name: name,
            user: user_id,
          },
        }).then((data) => {
          refetchTags();
          openNotification(
            "success",
            "Palabra Clave agregada",
            `La Palabra Clave ${name} fue agregada satisfactoriamente`
          );
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const modifyTag = async (name) => {
    if (selectedIds.length !== 0) {
      if (name !== "") {
        try {
          await updateTag({
            variables: {
              id: selectedIds[0],
              name: name,
            },
          }).then((data) => {
            refetchTags();
            openNotification(
              "success",
              "Palabra Clave editada",
              `La Palabra Clave ${name} fue editada satisfactoriamente`
            );
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    } else {
      openNotification(
        `success`,
        `Atención!`,
        `Selecione una Palabra Clave!!!`
      );
    }
  };

  const removeTag = async () => {
    notification.destroy();
    if (selectedIds.length === 1) {
      dispatch(startLoadingAction());
      await deleteTag({
        variables: {
          id: selectedIds[0],
        },
      }).then((data) => {
        refetchTags();
        openNotification(
          "success",
          "Palabra Clave eliminada",
          `La Palabra Clave fue eliminada satisfactoriamente`
        );
        //dispatch(finishLoadingAction());
      });
    } else if (selectedIds.length > 1) {
      // console.log(selectedIds);
      dispatch(startLoadingAction());
      try {
        await deleteTags({
          variables: {
            ids: selectedIds,
          },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Palabra Clave eliminada",
            `Las palabras clave fueron eliminadas satisfactoriamente`
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrió un error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else {
      openNotification(
        "warning",
        "Atención!!",
        `Seleccione una Palabra Clave!`
      );
    }
  };

  const clean = () => {
    setSelectedIds([]);
    setTags([]);
    refetchTags();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={removeTag}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atención!",
        description: "Esta seguro que desea eliminar la Palabra Clave?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una Palabra Clave!"
      );
    }
  };

  useEffect(() => {
    dispatch(startLoadingAction());
    refetchTags();
  }, []);
  useEffect(() => {
    if (tagsFromServer !== undefined) {
      const { Tags } = tagsFromServer;
      //console.table(tags);
      fillTagsData(Tags);
    }
  }, [tagsFromServer]);

  return (
    // <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
    <div className=" overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg  dark:bg-gray-800">
      {loading === false ? (
        <div>
          <h1 className="flex text-2xl my-2">
            <p className="mx-2 ">Lista de Palabras Clave</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" my-2 h-6 w-6"
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
          </h1>
          <hr className="w-1/4"></hr>

          <div className="flex mx-auto my-8">
            <button
              className="bg-gradient-to-r from-green-600 to-green-400 flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  hover:bg-green-400  focus:outline-none text-white"
              type="button"
              onClick={() => {
                setShowModal(true);
                setAction("save");
              }}
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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="mx-1">Añadir</span>
            </button>
            <button
              onClick={() => {
                if (selectedIds.length !== 0) {
                  if (tags.length !== 0) {
                    const tag = tags.filter((tag) => {
                      return tag.key == selectedIds[0];
                    });

                    if (tag.length !== 0) {
                      const { name } = tag[0];

                      setTagName(name);
                      setAction("update");
                      setShowModal(true);
                    }
                  }
                } else {
                  openNotification(
                    "warning",
                    "Atención!",
                    "Debe seleccionar una Palabra Clave!"
                  );
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-400 flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent hover:bg-blue-400  focus:outline-none outline-none text-white"
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

            <button
              onClick={() => {
                openNotificationDelete();
              }}
              className="bg-gradient-to-r from-red-600 to-red-400 flex mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  hover:bg-red-400 focus:outline-none text-white"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="mx-1">Eliminar</span>
            </button>
          </div>

          <hr className="my-8"></hr>
          <div>
            {tags.length !== 0 ? (
              <TagTable
                tagsList={tags}
                setSelectedIds={setSelectedIds}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay palabras clave en la base de datos aun.
                </h1>
                <p
                  onClick={() => {
                    setShowModal(true);
                    setAction("save");
                  }}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Palabra Clave +
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading className="my-10" />
      )}
      <TagModal
        action={action}
        show={showModal}
        setTagName={setTagName}
        tag={tagName}
        setShowModal={setShowModal}
        saveTag={saveTag}
        modifyTag={modifyTag}
      />
    </div>
  );
};
