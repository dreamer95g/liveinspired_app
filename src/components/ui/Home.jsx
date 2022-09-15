import { Slider } from "./Slider";
import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { NOTES } from "../../graphql/queries/NotesQueries";
import { PHRASES } from "../../graphql/queries/PhrasesQueries";
import { notification } from "antd";
import { apollo_client } from "../../config/apollo";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { Loading } from "../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Home = ({ history }) => {
  // const [notes, setNotes] = useState("");
  const [phrases, setPhrases] = useState("");
  const [dailyPhrase, setDailyPhrase] = useState("");
  const [dailyAuthor, setDailyAuthor] = useState("");
  const [dailyTags, setDailyTags] = useState("");
  const [show, setShow] = useState(false);
  const [phraseToCopy, setPhraseToCopy] = useState({
    value: "",
    copied: false,
  });

  const { id: user_id } = useSelector((state) => state.auth);

  const { data: phrasesFromServer } = useQuery(PHRASES, {
    variables: { user_id: user_id },
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);

  const refetch = async () => {
    await apollo_client.refetchQueries({
      include: [PHRASES],
    });
  };

  const refresh = async () => {
    dispatch(startLoadingAction());
    await refetch();

    if (phrasesFromServer !== undefined && phrasesFromServer !== null) {
      const { Phrases } = phrasesFromServer;

      await getRandomPhrase(Phrases);

      if (Phrases !== null && Phrases.length !== 0) {
        setPhrases(Phrases.length);

        setTimeout(() => {
          assignPhraseToCopy();
        }, 2000);
      }
      dispatch(finishLoadingAction());
    }
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const getRandomPhrase = (phrases) => {
    let result = null;

    let pointer = phrases.length;
    if (pointer !== 0) {
      let phraseId = getRandomInt(0, pointer - 1);
      result = phrases[phraseId];
    }

    if (result !== null) {
      const { text, author, tags } = result;
      setDailyPhrase(text);
      setDailyAuthor(author);
      setDailyTags(tags);
    }
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const copyToClip = () => {
    assignPhraseToCopy();

    const { copied } = phraseToCopy;

    if (copied) {
      openNotification(
        "success",
        "Frase Copiada",
        "Frase copiada al portapapeles."
      );
    }
  };

  const assignPhraseToCopy = () => {
    let phraseText = document.getElementById("phrase")?.innerText;
    let authorText = document.getElementById("author")?.innerText;

    if (phraseText !== undefined) {
      let phrase = " " + phraseText + "   " + authorText;

      setPhraseToCopy({ value: phrase, copied: true });
    }
  };

  useEffect(async () => {
    if (phrasesFromServer !== undefined && phrasesFromServer !== null) {
      const { Phrases } = phrasesFromServer;

      await getRandomPhrase(Phrases);

      if (Phrases !== null && Phrases.length !== 0) {
        setPhrases(Phrases.length);

        setTimeout(() => {
          assignPhraseToCopy();
        }, 2000);
      }
    }
    // console.log(phrasesFromServer);
  }, [phrasesFromServer]);

  useEffect(async () => {
    dispatch(startLoadingAction());
    await refetch();
    dispatch(finishLoadingAction());
  }, []);

  return (
    <div>
      <div className="mt-0">
        {/* -------------------------------------Frase Diaria------------------------------------- */}

        {!loading ? (
          <div className="animate__animated animate__fadeIn my-6 border-b-4 border-t-4 border-r-4 border-l-4 border-blue-700 max-w-2xl px-8 py-4 mx-auto bg-white rounded-2xl shadow-2xl dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-light text-gray-600 dark:text-gray-400 my-2">
                {new Date().toLocaleDateString("es-es", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {phrasesFromServer !== undefined &&
                phrasesFromServer.Phrases.length !== 0 && (
                  <div className="flex">
                    <span onClick={refresh}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mx-2 cursor-pointer hover:text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </span>
                    <CopyToClipboard
                      text={phraseToCopy.value}
                      onCopy={copyToClip}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 cursor-pointer hover:text-blue-600"
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
                )}
            </div>

            <div className="mt-2">
              {phrasesFromServer !== undefined &&
              phrasesFromServer.Phrases.length !== 0 ? (
                <>
                  <h1 className="text-2xl font-bold cursor-pointer text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:no-underline">
                    Frase de Impacto del día
                  </h1>
                  <p
                    id="phrase"
                    className="mt-2 text-lg text-gray-600 dark:text-gray-300 text-justify"
                  >
                    {dailyPhrase}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold cursor-pointer text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:no-underline">
                    No hay frases que mostrar.
                  </h1>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <p
                id="author"
                className="text-blue-700 text-lg font-semibold cursor-pointer dark:text-blue-400 hover:no-underline"
              >
                {dailyAuthor}
              </p>
            </div>

            <div className="text-md font-semibold text-left cursor-pointer">
              {dailyTags.length !== 0 &&
                dailyTags.map((tag, i) => {
                  return (
                    <p
                      key={i}
                      className="text-blue-700  inline-block mx-2"
                    >{`#${tag.name}`}</p>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="flex content-center">
            <Loading className="my-8" />
          </div>
        )}

        <br />
        <br />
        <br />

        {/* <div className="flex flex-wrap content-center">
          <div className="w-full px-6  sm:w-1/2 xl:w-1/3 mx-auto">
            <div className="content-center border-2 cursor-pointer border-gray-50 flex items-center  py-6 shadow-2xl rounded-lg bg-white">
              <div className="flex mx-auto content-center">
                <>
                  <div
                    className="mx-5 p-3 rounded-full bg-green-700 bg-opacity-75 content-center "
                    onClick={() => {
                      history.push(`/dashboard/notes`);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8  text-white"
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
                  </div>

                  <div className="mx-auto">
                    <h4 className="text-2xl font-semibold my-auto">{notes}</h4>
                  </div>
                </>

                <>
                  <div
                    className="mx-5 p-3 rounded-full bg-blue-700 bg-opacity-75 content-center"
                    onClick={() => {
                      history.push(`/dashboard/phrases`);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
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
                  </div>

                  <div className="mx-auto">
                    <h4 className="text-2xl font-semibold my-auto">
                      {phrases}
                    </h4>
                  </div>
                </>
              </div>
            </div>
          </div>

          <br />
        </div> */}

        <br />

        <br />
      </div>
    </div>
  );
};
