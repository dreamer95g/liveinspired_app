import { PHRASE_BY_ID } from "../../graphql/queries/PhrasesQueries";
import { url_base } from "../../config/app";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { notification } from "antd";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";

export const PhraseScreen = ({ history }) => {
  const { id } = useParams();

  const [getPhraseById, { data: phrase }] = useLazyQuery(PHRASE_BY_ID);

  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  useEffect(() => {
    getPhraseById({
      variables: {
        id: id,
      },
    });

    dispatch(startLoadingAction());
  }, []);

  useEffect(() => {
    if (!phrase) {
      return <Redirect to="/dashboard/phrases" />;
    }

    const recipe = phrase.Phrase;

    if (recipe !== null) {
      // console.table(recipe);

      const { author, text, tags } = recipe;

      setAuthor(author);
      setText(text);

      const tgs =
        tags.length !== 0
          ? tags.map((tag) => {
              return tag.name;
            })
          : [];

      setTags(tgs);

      dispatch(finishLoadingAction());
    }
  }, [phrase]);

  const goBack = () => {
    history.push("/dashboard/phrases");
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  return (
    <div>
      <div className="border-2 border-gray-50 container px-8 py-4 mx-auto bg-white rounded-xl shadow-lg dark:bg-gray-800">
        {!loading ? (
          <div className="animate__animated animate__fadeIn">
            <div className="content-center text-center my-6 ">
              <div className="inline-flex items-center ">
                <h1 className="text-2xl mx-3 ">Ver frase de </h1>
                <h1 className="  text-2xl font-semibold text-blue-700 mx-1 ">{` ${author}`}</h1>
              </div>
            </div>

            <hr />

            <div>
              <div>
                <blockquote className="my-5 mx-5 px-5 py-5 ">
                  <div className="content-center flex">
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

                  <p className="text-lg text-center">{text}</p>
                </blockquote>
              </div>

              <hr />
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
                  <div className="text-md font-semibold text-center">
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

            <hr />

            <div className="my-10 flex content-center w-full ">
              <div className="flex mx-auto ">
                <button
                  onClick={goBack}
                  className="flex w-48 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-indigo-500 hover:bg-indigo-400  focus:outline-none "
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
                <button
                  onClick={() => {
                    history.push("/dashboard/search");
                  }}
                  className="flex w-48 h-11 mx-1 px-4 py-2 rounded-full border text-white border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 transform bg-transparent bg-blue-500 hover:bg-blue-400  focus:outline-none "
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
