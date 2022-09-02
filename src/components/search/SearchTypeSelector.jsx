import React from "react";

export const SearchTypeSelector = ({
  showNotesSection,
  showNoteSectionChange,
}) => {
  return (
    <div className="flex">
      {showNotesSection === true ? (
        <>
          <button
            onClick={showNoteSectionChange}
            className="
      border-b-2 border-indigo-500 w-24 text-indigo-600 py-4 px-1 block hover:border-indigo-500 hover:text-indigo-500 focus:outline-none "
          >
            Notas
          </button>

          <button
            onClick={showNoteSectionChange}
            className="
   border-b-2  w-24 text-gray-600 py-4 px-1 block  hover:border-indigo-500 hover:text-indigo-500 focus:outline-none "
          >
            Frases
          </button>
        </>
      ) : (
        <>
          <button
            onClick={showNoteSectionChange}
            className="
    w-24 text-gray-600 py-4 px-1 block border-b-2 hover:border-indigo-500 hover:text-indigo-500 focus:outline-none "
          >
            Notas
          </button>
          <button
            onClick={showNoteSectionChange}
            className="
    border-b-2 border-indigo-500 w-24 text-blue-600 py-4 px-1 block  hover:border-indigo-500 hover:text-indigo-500 focus:outline-none "
          >
            Frases
          </button>
        </>
      )}
    </div>
  );
};
