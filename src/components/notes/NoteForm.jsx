import { GenericTagsSelect } from "../common/GenericTagsSelect";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
//graphql
import {
  CREATE_NOTE,
  DISCONNECT_FOREIGN_KEYS,
  UPDATE_NOTE,
} from "../../graphql/mutations/NotesMutations";

import { NOTE_BY_ID } from "../../graphql/queries/NotesQueries";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Button, notification, Select, DatePicker } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";

import validator from "validator";

import { Input } from "antd";
import { apollo_client } from "../../config/apollo";
import moment from "moment/moment";

const { TextArea } = Input;

export const NoteForm = ({ history }) => {
  const { id } = useParams();
  const { id: user_id } = useSelector((state) => state.auth);

  const [createNote] = useMutation(CREATE_NOTE);
  const [disconnectForeignKeys] = useMutation(DISCONNECT_FOREIGN_KEYS);
  const [updateNote] = useMutation(UPDATE_NOTE);

  const [getNoteById, { data: note }] = useLazyQuery(NOTE_BY_ID);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  //------------------------------ATRIBUTOS---------------------------------------------//
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");
  const [text, setText] = useState("");

  const [tagsList, setTagsList] = useState([]);
  const [tags, setTags] = useState([]);

  //IDS DE LAS LLAVES FORANEAS PARA A HORA DE ACTUALIZAR
  const [oldTags, setOldTags] = useState([]);

  //---------------------------------------HANDLE INPUT CHANGE -------------------------//
  const handleInputDateChange = (date, dateString) => {
    // console.log(date, dateString);
    setDate(dateString);
  };

  const handleInputTextChange = ({ target }) => {
    setText(target.value);
  };

  //-------------------------------------------FUNCIONES------------------------------//

  const refetch = async () => {
    await apollo_client.clearStore({
      include: [NOTE_BY_ID],
    });
  };

  const controller = async () => {
    let isValid = validateForm();

    if (isValid) {
      dispatch(startLoadingAction());

      if (action === "save") {
        await saveNote();
      } else {
        await refetch();
        await modifyNote();
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (validator.isEmpty(date)) {
      openNotification("warning", "Atención", "Llene la fecha!");
      isValid = false;
    }

    if (validator.isEmpty(text)) {
      openNotification("warning", "Atención", "Escriba algo en la nota!");
      isValid = false;
    }

    if (tags.length === 0 && tagsList.length === 0) {
      openNotification(
        "warning",
        "Atención",
        "Seleccione al menos una etiqueta!"
      );
      isValid = false;
    }

    return isValid;
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const goBack = () => {
    history.push("/dashboard/notes");
    //history.goBack();
    // console.log(history);
  };

  const saveNote = async () => {
    try {
      await createNote({
        variables: {
          date: date,
          text: text,
          tags: tags,
          user: user_id,
        },
      }).then((data) => {
        const { id } = data.data.createNote;
        openNotification(
          "success",
          "Nota Guardada",
          `La nota se guardó de forma satisfactoria!`
        );
        dispatch(finishLoadingAction());
        history.push("/dashboard/notes");
      });
    } catch (error) {
      console.log(error.message);
      dispatch(finishLoadingAction());
      openNotification(
        "error",
        "Error",
        `Ocurrió algun error: ${error.message} !`
      );
    }
  };

  const modifyNote = async () => {
    const idNote = id;

    try {
      // let a = JSON.stringify(tags);
      // let b = JSON.stringify(oldTags);

      if (tags.length === 0) {
        await disconnectForeignKeys({
          variables: {
            id: idNote,
            tags: [],
          },
        }).then((data) => {
          //console.log(data)
        });
      } else {
        await disconnectForeignKeys({
          variables: {
            id: idNote,
            tags: oldTags,
          },
        }).then((data) => {
          //console.log(data)
        });
      }

      await updateNote({
        variables: {
          id: idNote,
          date: date,
          text: text,
          tags: tags,
        },
      }).then((data) => {
        setOldTags([]);
        openNotification(
          "success",
          "Nota Editada",
          "La nota se ha modificado de forma satisfactoria!"
        );
        dispatch(finishLoadingAction());
        history.push("/dashboard/notes");
      });
    } catch (error) {
      dispatch(finishLoadingAction());
      openNotification(
        "error",
        "Error",
        `Ocurrió algun error: ${error.message} !`
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
    action === "update" && getNoteById({ variables: { id: id } });
  }, [action]);

  useEffect(() => {
    if (note !== undefined) {
      try {
        const { date, text, tags } = note.Note;

        setDate(date);
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
  }, [note]);

  return (
    // <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <div className=" overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg  dark:bg-gray-800">
      {!loading ? (
        <div>
          <div className="text-center my-6 ">
            {action === "save" ? (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Guardar Nota</h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${date}`}</h1>
                </div>
              </div>
            ) : (
              <div className="content-center">
                <div className="inline-flex items-center">
                  <h1 className="text-2xl mx-3 ">Modificar Nota</h1>
                  <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{`${date}`}</h1>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="animate__animated animate__fadeIn">
            <div className="content-center text-center ">
              {/* --------------------------------------------------------------------------- */}
              <div className="mx-auto my-10">
                <DatePicker
                  style={{ width: "350px", borderRadius: "10px" }}
                  value={date !== "" && moment(date)}
                  onChange={handleInputDateChange}
                />
              </div>

              <hr />
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>

                <TextArea
                  value={text}
                  onChange={handleInputTextChange}
                  placeholder="Escriba la nota ... "
                  style={{
                    width: "550px",
                    borderRadius: "10px",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                  autoSize
                />
              </div>

              <div className="my-8">
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
                <GenericTagsSelect selectedTags={tagsList} setTags={setTags} />
              </div>
            </div>
          </div>

          <hr />
          <div className="my-10 flex content-center w-full ">
            <div className="flex mx-auto">
              <button
                onClick={controller}
                className="bg-gradient-to-r from-green-600 to-green-400 flex w-48 mx-1 px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none text-white"
                type="button"
              >
                {action === "save" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-4 h-6 w-6"
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
                      className="mx-4 h-6 w-6"
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
                className="bg-gradient-to-r from-blue-600 to-blue-400 flex  w-48 mx-1 px-4 py-2  rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none hover:bg-blue-400 text-white"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-4 h-6 w-6"
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
          <Loading />
        </div>
      )}
    </div>
  );
};
