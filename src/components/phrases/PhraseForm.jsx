import { GenericTagsSelect } from "../common/GenericTagsSelect";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
//graphql
import {
  CREATE_PHRASE,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_PHRASE,
} from "../../graphql/mutations/PhrasesMutations";

import { PHRASE_BY_ID } from "../../graphql/queries/PhrasesQueries";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Button, notification, Select, DatePicker } from "antd";

import { connect, useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

import validator from "validator";

import { Input } from "antd";
import { apollo_client } from "../../config/apollo";
import moment from "moment/moment";

//ADD TAG
import { TagModal } from "../tags/TagModal";
import { CREATE_TAG } from "../../graphql/mutations/TagsMutations";
import { TAGS } from "../../graphql/queries/TagsQueries";
// ---------------------------------------------------------------------//
const { TextArea } = Input;

export const PhraseForm = ({ history }) => {
  const { id } = useParams();
  const { id: user_id } = useSelector((state) => state.auth);
  const [createPhrase] = useMutation(CREATE_PHRASE);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updatePhrase] = useMutation(UPDATE_PHRASE);

  const [getPhraseById, { data: phrase }] = useLazyQuery(PHRASE_BY_ID);

  // Add Tag Modal //--------------------------------------------------------//
  const { data: tagsFromServer } = useQuery(TAGS, {
    variables: { user_id: user_id },
  });
  const [tagName, setTagName] = useState("");

  const [showModal, setShowModal] = useState(false);

  //-------------------------------------------------------------------------//
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const [createTag] = useMutation(CREATE_TAG);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const [tagsList, setTagsList] = useState([]);
  const [tags, setTags] = useState([]);

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldTags, setOldTags] = useState([]);

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputAuthorChange = ({ target }) => {
    setAuthor(target.value);
  };

  const handleInputTextChange = ({ target }) => {
    setText(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const refetchTags = async () => {
    await apollo_client.refetchQueries({
      include: [TAGS],
    });
    dispatch(finishLoadingAction());
  };

  // agregar etiquetas si no existen
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
            `La Palabra Clave ${name} fue agregada satisfactoriamente`,
              "top"
          );
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [PHRASE_BY_ID],
    });
  };

  const controller = async () => {
    let isValid = validateForm();

    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await savePhrase();
      } else {
        await refetch();
        await modifyPhrase();
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(author)) {
      openNotification("warning", "Atención", "Llene el autor!");
      isValid = false;
    }

    if (validator.isEmpty(text)) {
      openNotification("warning", "Atención", "Escriba algo en la frase!");
      isValid = false;
    }

    if (tags.length === 0 && tagsList.length === 0) {
      openNotification(
        "warning",
        "Atención",
        "Seleccione al menos una etiqueta!",
          "top"
      );
      isValid = false;
    }

    return isValid;
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description, placement) => {
    notification[type]({
      message:message,
      description: description,
      placement: placement,
    });
  };


  const goBack = () => {
    history.push("/dashboard/phrases");
    //history.goBack();
    // console.log(history);
  };

  const savePhrase = async () => {
    try {
      await createPhrase({
        variables: {
          text: text,
          author: author,
          tags: tags,
          user: user_id,
        },
      }).then((data) => {
        const { id } = data.data.createPhrase;
        openNotification(
          "success",
          "Frase Guardada",
          `La frase se guardó de forma satisfactoria!`,
            "top"
        );
        dispatch(finishLoadingAction());
        history.push("/dashboard/phrases");
      });
    } catch (error) {
      console.log(error.message);
      dispatch(finishLoadingAction());
      openNotification(
        "error",
        "Error",
        `Ocurrió algun error: ${error.message} !`,
          "top"
      );
    }
  };

  const modifyPhrase = async () => {
    const idPhrase = id;

    try {
      // let a = JSON.stringify(tags);
      // let b = JSON.stringify(oldTags);

      if (tags.length === 0) {
        await disconnectForeignKeys({
          variables: {
            id: idPhrase,
            tags: [],
          },
        }).then((data) => {
          //console.log(data)
        });
      } else {
        await disconnectForeignKeys({
          variables: {
            id: idPhrase,
            tags: oldTags,
          },
        }).then((data) => {
          //console.log(data)
        });
      }

      await updatePhrase({
        variables: {
          id: idPhrase,
          text: text,
          author: author,
          tags: tags,
        },
      }).then((data) => {
        setOldTags([]);
        openNotification(
          "success",
          "Frase Editada",
          "La frase se ha modificado de forma satisfactoria!",
            "top"
        );
        dispatch(finishLoadingAction());
        history.push("/dashboard/phrases");
      });
    } catch (error) {
      dispatch(finishLoadingAction());
      openNotification(
        "error",
        "Error",
        `Ocurrió algun error: ${error.message} !`,
          "top"
      );
    }
  };

  // -------------------------------EFFECTS----------------------------------------------//
  useEffect(() => {
    if (id !== undefined) {
      dispatch(startLoadingAction());
      setAction("update");
    } else {
      setAction("save");
    }
  }, []);

  useEffect(async () => {
    action === "update" && getPhraseById({ variables: { id: id } });
  }, [action]);

  useEffect(() => {
    if (phrase !== undefined) {
      try {
        const { author, text, tags } = phrase.Phrase;

        setAuthor(author);
        setText(text);
        setTagsList(tags);

        dispatch(finishLoadingAction());

        setOldTags(
          tags.map((tag) => {
            return tag.id;
          })
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [phrase]);

  return (
    // <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl shadow-lg dark:bg-gray-800">
    <div className="border-2 border-gray-50 shadow-2xl overflow-auto animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl  dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 pt-5">Guardar frase de </h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 pt-5 ">{` ${author}`}</h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 pt-5">Editar frase de </h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 pt-5">{` ${author}`}</h1>
                </div>
              </div>
            )}
          </div>

          <hr className="w-1/2 text-center content-center mx-auto" />

          <div className="animate__animated animate__fadeIn">
            <div className="content-center text-center ">
              {/* --------------------------------------------------------------------------- */}
              <div className="mx-auto my-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-7 w-7 my-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <Input
                  placeholder="Autor"
                  value={author}
                  onChange={handleInputAuthorChange}
                  style={{ width: "350px", borderRadius: "10px" }}
                />
              </div>

              <hr className="w-1/2 text-center content-center mx-auto" />
              <div className="my-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-7 w-7 my-2"
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

                <TextArea
                  value={text}
                  onChange={handleInputTextChange}
                  placeholder="Escriba la frase ... "
                  style={{
                    width: "500px",
                    borderRadius: "10px",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                  autoSize
                />
              </div>

              <div className="my-8 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mx-auto my-2"
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
                <div className="flex ">
                  <div className="flex content-center mx-auto">
                    {" "}
                    <GenericTagsSelect
                      selectedTags={tagsList}
                      setTags={setTags}
                    />
                    <span
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-1 my-auto cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="w-1/2 text-center content-center mx-auto" />
          <div className="my-10 flex content-center w-full ">
            <div className="flex mx-auto">
              <button
                onClick={controller}
                className="bg-gradient-to-r from-green-600 to-green-500 flex mx-auto w-38  px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none text-white"
                type="button"
              >
                {action === "save" ? (
                  <>
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span className="mx-1">Guardar</span>
                  </>
                ) : (
                  <>
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="mx-1">Editar</span>
                  </>
                )}
              </button>
              <button
                onClick={goBack}
                className="bg-gradient-to-r from-blue-600 to-blue-500 flex  w-38 mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent focus:outline-none hover:bg-blue-400 text-white"
                type="button"
              >
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
                    d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                  />
                </svg>
                <span className="mx-1">Regresar</span>
              </button>
            </div>
          </div>

          {/* <footer>
                 <Footer/>
             </footer>  */}
        </div>
      ) : (
        <div>
          <Loading className="my-10" />
        </div>
      )}
      <TagModal
        action={"save"}
        show={showModal}
        setTagName={setTagName}
        tag={tagName}
        setShowModal={setShowModal}
        saveTag={saveTag}
        modifyTag={""}
      />
    </div>
  );
};
