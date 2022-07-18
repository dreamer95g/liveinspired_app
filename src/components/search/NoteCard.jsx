import React, { useEffect } from "react";

export const NoteCard = ({ history, note }) => {
  useEffect(() => {}, []);
  return (
    <div className="animate__animated animate__fadeIn inline-block mx-3 border-2 border-gray-50 max-w-sm p-6 m-auto my-5 bg-white rounded-md shadow-lg dark:bg-gray-800">
      <h1
        className="text text-justify cursor-pointer hover:text-blue-700"
        onClick={() => {
          if (note.id !== undefined) {
            const { id } = note;
            history.push(`/dashboard/notes/view/${id}`);
          }
        }}
      >
        {note !== undefined && note.text}
      </h1>
      <div className="text-md font-semibold text-center">
        {(note !== undefined && note.tags.length) !== 0 &&
          note.tags.map((tag, i) => {
            return (
              <p
                key={i}
                className="text-blue-700 text-lg inline-block mx-2"
              >{`${tag}`}</p>
            );
          })}
      </div>
    </div>
  );
};
