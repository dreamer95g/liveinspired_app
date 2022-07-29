import { NOTES } from "../../graphql/queries/NotesQueries";
import { DELETE_NOTE } from "../../graphql/mutations/NotesMutations";
import { DELETE_NOTES } from "../../graphql/mutations/NotesMutations";
import { TAGS } from "../../graphql/queries/TagsQueries";

import { NoteTable } from "./NoteTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const NoteList = ({ history }) => {
  // ---------------------------DECLARACIONES------------------------------------------//
  const { id: user_id } = useSelector((state) => state.auth);

  const { data: notesFromServer } = useQuery(NOTES, {
    variables: { user_id: user_id },
  });

  const [deleteNote] = useMutation(DELETE_NOTE);
  const [deleteNotes] = useMutation(DELETE_NOTES);

  const { data: tagsFromServer } = useQuery(TAGS, {
    variables: { user_id: user_id },
  });

  const [noteList, setNoteList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS DE LA TABLA DE NOTAS
  const [tagFilter, setTagFilter] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  // ----------------------------FUNCIONES----------------------------------//
  const fillNotesData = (notes) => {
    setNoteList([]);

    notes.forEach((note) => {
      const { tags } = note;

      const record = {
        key: note.id,
        text: note.text,
        date: note.date,

        tags:
          tags.length !== 0
            ? tags.map((tag) => {
                return tag.name;
              })
            : "",
      };

      setNoteList((noteList) => [...noteList, record]);
    });
  };

  const deleteNoteById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deleteNote({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Información",
            "Nota eliminada satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error.name);
        openNotification("error", "Error!", `Ocurrió una error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else if (selectedIds.length > 1) {
      try {
        await deleteNotes({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Información",
            "Notas eliminadas satisfactoriamente!"
          );
          clean();
          // dispatch(finishLoadingAction());
        });
      } catch (error) {
        console.log(error);
        // openNotification("error", "Error!", `Ocurrió una error: ${error.name}`);
        // dispatch(finishLoadingAction());
      }
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una nota!"
      );
    }
  };

  const clean = () => {
    setSelectedIds([]);
    refetchNotes();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deleteNoteById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atención!",
        description: "Esta seguro que desea eliminar la nota?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una nota!"
      );
    }
  };

  const goToCreateNote = () => {
    history.push("/dashboard/notes/form");
  };

  const refetchNotes = async () => {
    await apollo_client.refetchQueries({
      include: [NOTES, TAGS],
    });
    dispatch(finishLoadingAction());
  };

  const goToViewNote = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/notes/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una nota!"
      );
    }
  };

  const goToUpdateNote = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/notes/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una nota!"
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

  // -----------------------------EFFECTS------------------------------------//
  useEffect(() => {
    if (notesFromServer !== undefined) {
      const { Notes } = notesFromServer;

      if (Notes !== null && Notes !== undefined) {
        fillNotesData(Notes);
      }
    }
  }, [notesFromServer]);

  useEffect(() => {
    if (tagsFromServer !== undefined) {
      const { Tags } = tagsFromServer;

      let tagFilt = [];

      Tags.forEach((tag) => {
        const elem = {
          text: tag.name,
          value: tag.name,
        };

        tagFilt.push(elem);
      });

      setTagFilter(tagFilt);
    }
  }, [tagsFromServer]);

  useEffect(() => {
    if (noteList.length !== 0) {
      setNotes(noteList);
    }
  }, [noteList]);

  //RECARGAR LAS QUERIES
  useEffect(() => {
    dispatch(startLoadingAction());

    refetchNotes();
  }, []);

  return (
    // <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <div className=" overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-lg  dark:bg-gray-800">
      {loading === false ? (
        <div className="overflow-hidden ">
          <div>
            <h1 className="flex text-2xl my-1">
              <p className="mx-2 ">Lista de las Notas</p>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 my-2"
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
            </h1>
            <hr className="w-1/4"></hr>
          </div>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreateNote}
              className="flex mx-1 px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-gradient-to-r from-green-600 to-green-400 focus:outline-none text-white"
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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="mx-1">Añadir</span>
            </button>
            <button
              onClick={goToUpdateNote}
              className="bg-gradient-to-r from-blue-600 to-blue-400 flex mx-1 px-4 py-2 hover:bg-blue-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none outline-none text-white"
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
              onClick={goToViewNote}
              className="bg-gradient-to-r from-indigo-600 to-indigo-400 flex mx-1 px-4 py-2 hover:bg-indigo-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none text-white"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="mx-1">Ver</span>
            </button>
            <button
              onClick={openNotificationDelete}
              className="flex mx-1 px-4 py-2 hover:bg-red-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-gradient-to-r from-red-600 to-red-400 focus:outline-none text-white"
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
            {notes.length !== 0 ? (
              <NoteTable
                noteList={notes}
                setSelectedIds={setSelectedIds}
                tagFilter={tagFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay notas en la base de datos aun.
                </h1>
                <p
                  onClick={goToCreateNote}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Nota +
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading className="my-10" />
      )}

      {/* <footer>
                 <Footer/>
             </footer>  */}
    </div>
  );
};
