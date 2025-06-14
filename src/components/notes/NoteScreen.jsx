import { NOTE_BY_ID } from "../../graphql/queries/NotesQueries";
import { url_base } from "../../config/app";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { notification } from "antd";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "antd";
import {CopyToClipboard} from "react-copy-to-clipboard";
const { TextArea } = Input;

export const NoteScreen = ({ history }) => {
  const { id } = useParams();

  const [getNoteById, { data: note }] = useLazyQuery(NOTE_BY_ID);

  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [noteToCopy, setNoteToCopy] = useState({
    value: "",
    copied: false,
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    getNoteById({
      variables: {
        id: id,
      },
    });

    dispatch(startLoadingAction());
  }, []);

  useEffect(async () => {
    if (!note) {
      return <Redirect to="/dashboard/notes" />;
    }

    const recipe = note.Note;

    if (recipe !== null) {
      // console.table(recipe);

      const { date, text, tags } = recipe;

      setDate(date);
      setText(text);

      const tgs =
        tags.length !== 0
          ? tags.map((tag) => {
              return tag.name;
            })
          : [];

       setTags(tgs);

      //PARA QUE CARGUE
      setTimeout(() => {
        assignNoteToCopy();
      }, 4000);

      dispatch(finishLoadingAction());
    }
  }, [note]);

  const goBack = () => {
    history.push("/dashboard/notes");
  };


  //METODO PARA COPIAR LA NOTA AL PORTAPAPELES
  const assignNoteToCopy = () => {

    let dateText = document.getElementById("date")?.innerText;
    let noteText = document.getElementById("note")?.innerText;
    let tagsText = document.getElementById("tags")?.innerText;

    console.log(noteText);
    console.log(tagsText);

    if (noteText !== "" && tagsText !== "" && dateText !== "") {
      let note = "Fecha: "+ date + " \n \n " + noteText + " \n \n " + tagsText;
      setNoteToCopy({ value: note, copied: true });
      console.log(noteToCopy);
    }else{

    }
  };

  //METODO PARA COPIAR
  const copyToClip =  async () => {

    await assignNoteToCopy();

    const { copied } = noteToCopy;
    console.log(copied);
    if (copied) {
      openNotification(
          "success",
          "Nota Copiada",
          "Nota copiada al portapapeles.",
          "top"
      );
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description,placement) => {
    notification[type]({
      message: message,
      description: description,
      placement:placement
    });
  };

  return (
    <div>
      {/* <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-xl shadow-lg dark:bg-gray-800"> */}
      <div className="border-2 border-gray-50 shadow-2xl overflow-auto container px-8 py-4 mx-auto bg-white rounded-2xl  dark:bg-gray-800">
        {!loading ? (
          <div className="animate__animated animate__fadeIn">
            <div className="content-center text-center my-8">
              <div className="inline-flex items-center ">
                <h1 className="text-2xl mx-3 pt-5 ">Ver nota </h1>
                <h1 className="  text-2xl font-semibold text-blue-700 mx-3 pt-5" id="date">{`${date}`}</h1>
                <br/>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center'}} >
                <CopyToClipboard
                    text={noteToCopy.value}
                    onCopy={copyToClip}
                >
                      <span >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 cursor-pointer hover:text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </span>
                </CopyToClipboard>
              </div>
            </div>

            <hr className="w-1/2 text-center content-center mx-auto" />

            <div>
              <div>
                <blockquote className="my-5 mx-5 px-5 py-5 ">
                  <div className="content-center flex text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mx-auto my-1 h-8 w-8"
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
                    {/* <h1 className="mx-auto text-xl text-center">Dni </h1> */}
                  </div>
                  <br />
                  <div className="mx-auto text-center content-center">
                    <div  id="note" hidden={true}>
                      {text}
                    </div>
                    <TextArea
                      value={text}
                      style={{
                        width: "700px",
                        borderRadius: "10px",
                        paddingTop: "15px",
                        paddingBottom: "15px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        disabled: true,
                      }}
                      autoSize
                    />
                  </div>

                  {/* <p className="text-lg text-justify ">{text}</p> */}
                </blockquote>
              </div>

              <hr className="w-1/2 text-center content-center mx-auto" />
              <div className="">
                <blockquote className="my-5 mx-5 px-5 py-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto my-1"
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
                  <div className="text-md font-semibold text-center" id="tags">
                    {tags.map((tg, i) => {
                      return (
                        <p
                          key={i}
                          className="text-blue-700 inline-block mx-2 text-xl"
                        >{`#${tg}`}</p>
                      );
                    })}
                  </div>
                </blockquote>
              </div>
            </div>

            <hr className="w-1/2 text-center content-center mx-auto" />

            <div className="my-10 flex content-center w-full ">
              <div className="flex mx-auto ">
                <button
                  onClick={goBack}
                  className="bg-gradient-to-r from-green-600 to-green-500 flex w-38 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  hover:bg-indigo-400  focus:outline-none "
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
                <button
                  onClick={() => {
                    history.push("/dashboard/search");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 flex w-38 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent  hover:bg-blue-400  focus:outline-none "
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
                      d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="mx-1">Buscar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex content-center">
            <Loading className="my-8" />
          </div>
        )}
      </div>
    </div>
  );
};
