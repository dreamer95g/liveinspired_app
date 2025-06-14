import { TAGS } from "../../graphql/queries/TagsQueries";
import { NOTE_BY_TAG } from "../../graphql/queries/NotesQueries";
import { PHRASE_BY_TAG } from "../../graphql/queries/PhrasesQueries";
import { PHRASES } from "../../graphql/queries/PhrasesQueries";
import { NOTES } from "../../graphql/queries/NotesQueries";
import React, { useEffect, useState } from "react";
import { Select, notification } from "antd";
import { useLazyQuery, useQuery } from "@apollo/client";
import { NoteCard } from "./NoteCard";
import { Loading } from "../ui/Loading";
import { startLoadingAction, finishLoadingAction } from "../../actions/ui";
import { useDispatch, useSelector } from "react-redux";
import { apollo_client } from "../../config/apollo";
import { SearchTypeSelector } from "./SearchTypeSelector";
import { PhraseCard } from "./PhraseCard";

export const MainSearch = ({ history }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ui);
  const { id: user_id } = useSelector((state) => state.auth);
  const [getTags, { data: tagsFromServer }] = useLazyQuery(TAGS);

  const [getNotesByTag, { data: notes }] = useLazyQuery(NOTE_BY_TAG);
  const [getPhrasesByTag, { data: phrases }] = useLazyQuery(PHRASE_BY_TAG);

  let OPTIONS = tagsFromServer !== undefined ? tagsFromServer.Tags : [];

  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const [resultsFounded, setResultsFounded] = useState([]);

  const [showNotesSection, setShowNotesSection] = useState(true);

  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  const handleChange = (selectedTags) => {
    // console.log(selectedTags);
    setSelectedTags(selectedTags);
  };

  const filteredOptions =
    OPTIONS !== undefined
      ? OPTIONS.filter((search) => !selectedTags.includes(search))
      : [];

  const getTagIdsFromSelectedItems = (selectedTags) => {
    let tagsId = [];

    selectedTags.forEach((name) => {
      OPTIONS.forEach((element) => {
        if (element.name === name) {
          tagsId.push(element.id);
        }
      });
    });

    return tagsId;
  };

  const search = () => {
    dispatch(startLoadingAction());
    if (selectedTags.length !== 0) {
      if (showNotesSection) {
        // dispatch(startLoadingAction());
        setResultsFounded([]);
        refetch();
        getNotesByTag({
          variables: {
            tags: tags,
            user_id: user_id,
          },
        });
      } else {
        // dispatch(startLoadingAction());
        setResultsFounded([]);
        refetch();
        getPhrasesByTag({
          variables: {
            tags: tags,
            user_id: user_id,
          },
        });
      }
    } else {
      dispatch(finishLoadingAction());
      openNotification("warning", "Atención", "Seleccione las Palabras Clave", "top");
    }
  };

  // METODO QUE LANZA LAS NOTIFICACIONES
  const openNotification = (type, message, description, placement) => {
    notification[type]({
      message: message,
      description: description,
      placement: placement
    });
  };

  const refetch = async () => {
    await apollo_client.refetchQueries({
      include: "active",
    });
    // dispatch(finishLoadingAction());
  };

  const showNoteSectionChange = () => {
    setShowNotesSection(!showNotesSection);
    setSelectedTags([]);
  };

  useEffect(() => {}, [resultsFounded]);

  useEffect(() => {
    if (notes !== undefined) {
      const notesFounds = notes.NoteByTag;

      const nts = notesFounds.length !== 0 ? notesFounds : [];

      // console.log(nts);

      if (nts.length !== 0) {
        nts.forEach((not) => {
          const { id, text, tags } = not;

          let tgs = [];

          if (tags.length !== 0) {
            tags.forEach((c) => {
              tgs.push(`#${c.name}`);
            });
          }

          const reducedNote = text.substring(0, 300) + " ...";

          const elem = {
            id: id,
            text: reducedNote,
            tags: tgs,
          };
          setResultsFounded((resultsFounded) => [...resultsFounded, elem]);
        });
      } else {
        setShowEmptyMessage(true);
      }
      dispatch(finishLoadingAction());
    }
    dispatch(finishLoadingAction());
  }, [notes]);

  useEffect(() => {
    if (phrases !== undefined) {
      const phrasesFounded = phrases.PhraseByTag;

      const phs = phrasesFounded.length !== 0 ? phrasesFounded : [];

      // console.log(phs);

      if (phs.length !== 0) {
        phs.forEach((ph) => {
          const { id, text, tags } = ph;

          let tgs = [];

          if (tags.length !== 0) {
            tags.forEach((c) => {
              tgs.push(`#${c.name}`);
            });
          }



          const elem = {
            id: id,
            text: text,
            tags: tgs,
          };
          setResultsFounded((resultsFounded) => [...resultsFounded, elem]);
        });
      } else {
        setShowEmptyMessage(true);
      }
      dispatch(finishLoadingAction());
    }
    dispatch(finishLoadingAction());
  }, [phrases]);

  useEffect(() => {
    const tags = getTagIdsFromSelectedItems(selectedTags);
    setTags(tags);
    // console.log(tags);
    setResultsFounded([]);
    setShowEmptyMessage(false);
  }, [selectedTags]);

  useEffect(() => {
    getTags({
      variables: {
        user_id: user_id,
      },
    });
    setShowNotesSection(true);
    refetch();
  }, []);

  useEffect(() => {
    // console.log(tagsFromServer);
    if (tagsFromServer !== undefined) {
      OPTIONS = tagsFromServer.tags;
    }
  }, [tagsFromServer]);

  return (
    // <div className=" border-2 border-gray-50 overflow-hidden animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl shadow-lg dark:bg-gray-800">
    <div className="border-2 border-gray-50 shadow-2xl overflow-auto animate__animated animate__fadeIn container px-8 py-4 mx-auto bg-white rounded-2xl dark:bg-gray-800">
      <div className="text-center content-center text-lg my-4 ">
        <nav className="flex ">
          <div className="mx-auto flex">
            <SearchTypeSelector
              showNotesSection={showNotesSection}
              showNoteSectionChange={showNoteSectionChange}
            />
          </div>
        </nav>
      </div>
      <br />
      <hr />

      <div className=" flex content-center my-8">
        <div className="flex mx-auto">
          <Select
            mode="multiple"
            placeholder="Seleccione las Palabras Clave"
            value={selectedTags}
            onChange={handleChange}
            style={{ width: "350px", borderRadius: "10px" }}
            dropdownStyle={{ borderRadius: "10px" }}
          >
            {filteredOptions.length !== 0 &&
              filteredOptions.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.name}
                  style={{ borderRadius: "10px" }}
                >
                  {item.name}
                </Select.Option>
              ))}
          </Select>
          <button
            onClick={search}
            className=" rounded-md bg-blue-600 flex w-16 mx-auto h-8 px-1 py-1 text-center hover:bg-blue-400  border border-gray-300 font-medium tracking-wide capitalize transition-colors duration-200 focus:outline-none text-white"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 content-center mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {!loading ? (
        <div className="card-columns">
          {resultsFounded.length !== 0 && showNotesSection === true
            ? resultsFounded.map((note) => (
                <NoteCard key={note.id} note={note} history={history} />
              ))
            : resultsFounded.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} history={history} />
              ))}

          {showEmptyMessage === true ? (
            <div>
              <p className="text-center text-xl">
                No se encontraron resultados
              </p>
            </div>
          ) : (
            resultsFounded.length !== 0 && (
              <div className="flex content-center ">
                <div className="flex mx-auto cursor-default">
                  <p className=" text-xl my-7 mx-1 text-center">
                    Se encontraron
                  </p>
                  <p className="text-blue-700 text-xl my-7 mx-1 text-center">{`${resultsFounded.length}`}</p>
                  <p className="text-xl my-7 mx-1 text-center">resultados</p>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <Loading />
      )}

      <br />
      <br />
    </div>
  );
};
