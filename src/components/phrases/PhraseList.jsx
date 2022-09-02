import { PHRASES } from "../../graphql/queries/PhrasesQueries";
import { DELETE_PHRASE } from "../../graphql/mutations/PhrasesMutations";
import { DELETE_PHRASES } from "../../graphql/mutations/PhrasesMutations";
import { TAGS } from "../../graphql/queries/TagsQueries";

import { PhraseTable } from "./PhraseTable";
import { apollo_client } from "../../config/apollo";

import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";

import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { notification, Button } from "antd";

import { useDispatch, useSelector } from "react-redux";

export const PhraseList = ({ history }) => {
  // ---------------------------DECLARACIONES------------------------------------------//

  const { id: user_id } = useSelector((state) => state.auth);

  const { data: phraseFromServer } = useQuery(PHRASES, {
    variables: { user_id: user_id },
  });

  const [deletePhrase] = useMutation(DELETE_PHRASE);
  const [deletePhrases] = useMutation(DELETE_PHRASES);

  const { data: tagsFromServer } = useQuery(TAGS, {
    variables: { user_id: user_id },
  });

  const [phraseList, setPhraseList] = useState([]);
  const [phrases, setPhrases] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  //FILTROS DE LA TABLA
  const [tagFilter, setTagFilter] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  // ----------------------------FUNCIONES----------------------------------//
  const fillPhrasesData = (phrases) => {
    setPhraseList([]);

    phrases.forEach((phrase) => {
      const { tags } = phrase;

      const record = {
        key: phrase.id,
        text: phrase.text,
        author: phrase.author,

        tags:
          tags.length !== 0
            ? tags.map((tag) => {
                return tag.name;
              })
            : "",
      };

      setPhraseList((phraseList) => [...phraseList, record]);
    });
  };

  const deletePhraseById = async () => {
    dispatch(startLoadingAction());

    notification.destroy();

    if (selectedIds.length === 1) {
      try {
        await deletePhrase({
          variables: { id: selectedIds[0] },
        }).then((data) => {
          openNotification(
            "success",
            "Información",
            "Frase eliminada satisfactoriamente!"
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
        await deletePhrases({
          variables: { ids: selectedIds },
        }).then((data) => {
          // console.log(data);
          openNotification(
            "success",
            "Información",
            "Frases eliminadas satisfactoriamente!"
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
        "Debe seleccionar al menos una frase!"
      );
    }
  };

  const clean = () => {
    setSelectedIds([]);
    //setPhraseList([]);
    //setPhrases([]);
    refetchPhrases();
  };

  const openNotificationDelete = () => {
    if (selectedIds.length !== 0) {
      const key = `open${Date.now()}`;

      const btn = (
        <Button
          type="danger"
          onClick={deletePhraseById}
          style={{ borderRadius: "100px" }}
        >
          Confirmar
        </Button>
      );
      notification.open({
        message: "Atención!",
        description: "Esta seguro que desea eliminar la frase?",
        btn,
        key,
      });
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una frase!"
      );
    }
  };

  const goToCreatePhrase = () => {
    history.push("/dashboard/phrases/form");
  };

  const refetchPhrases = async () => {
    await apollo_client.refetchQueries({
      include: [PHRASES, TAGS],
      // include: "active",
    });

    dispatch(finishLoadingAction());
  };

  const goToViewPhrase = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/phrases/view/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una frase!"
      );
    }
  };

  const goToUpdatePhrase = () => {
    if (selectedIds.length !== 0) {
      const id = selectedIds[0];

      if (id !== undefined && id !== "") {
        history.replace(`/dashboard/phrases/form/${id}`);
      }
    } else {
      openNotification(
        "warning",
        "Atención!",
        "Debe seleccionar al menos una frase!"
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
    if (phraseFromServer !== undefined) {
      const { Phrases } = phraseFromServer;

      if (Phrases !== null && Phrases !== undefined) {
        fillPhrasesData(Phrases);
      }
    }
  }, [phraseFromServer]);

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
    if (phraseList.length !== 0) {
      setPhrases(phraseList);
    }
  }, [phraseList]);

  //RECARGAR LAS QUERIES
  useEffect(async () => {
    dispatch(startLoadingAction());
    refetchPhrases();
  }, []);

  return (
    // <div className="border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl shadow-lg dark:bg-gray-800">
    <div className=" overflow-auto border-2 border-gray-50 shadow-2xl animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl dark:bg-gray-800">
      {loading === false ? (
        <div className="overflow-hidden ">
          <div>
            <h1 className="flex text-2xl my-1 pl-5 pt-5">
              <p className="mx-2 ">Lista de las Frases</p>

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
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            </h1>
            <hr className="w-1/4"></hr>
          </div>

          <div className="flex mx-auto my-8">
            <button
              onClick={goToCreatePhrase}
              className="bg-gradient-to-r from-green-600 to-green-500 flex mx-1 px-4 py-2 hover:bg-green-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent focus:outline-none text-white"
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
              onClick={goToUpdatePhrase}
              className="bg-gradient-to-r from-blue-600 to-blue-500 flex mx-1 px-4 py-2 hover:bg-blue-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 focus:outline-none outline-none text-white"
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
              onClick={goToViewPhrase}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 flex mx-1 px-4 py-2 hover:bg-indigo-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none text-white"
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
              className="bg-gradient-to-r from-red-600 to-red-500 flex mx-1 px-4 py-2 hover:bg-red-400 rounded-full border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  focus:outline-none text-white"
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
            {phrases.length !== 0 ? (
              <PhraseTable
                phraseList={phrases}
                setSelectedIds={setSelectedIds}
                tagFilter={tagFilter}
                className="my-6"
              />
            ) : (
              <div className="mx-auto my-6 content-center text-center animate__animated animate__fadeIn">
                <h1 className=" text-xl text-center my-4">
                  No hay frases en la base de datos aun.
                </h1>
                <p
                  onClick={goToCreatePhrase}
                  className="animate-pulse font-semibold text-2xl cursor-pointer text-md text-blue-700 text-center content-center my-4  hover:underline"
                >
                  Agregar Frase +
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
