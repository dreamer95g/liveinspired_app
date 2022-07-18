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
      border-b-2 border-blue-500 w-24 text-blue-600 py-4 px-1 block hover:border-blue-500 hover:text-blue-500 focus:outline-none hover:font-medium"
          >
            Notas
          </button>

          <button
            onClick={showNoteSectionChange}
            className="
   border-b-2  w-24 text-gray-600 py-4 px-1 block  hover:border-blue-500 hover:text-blue-500 focus:outline-none hover:font-medium"
          >
            Frases
          </button>
        </>
      ) : (
        <>
          <button
            onClick={showNoteSectionChange}
            className="
    w-24 text-gray-600 py-4 px-1 block border-b-2 hover:border-blue-500 hover:text-blue-500 focus:outline-none hover:font-medium"
          >
            Notas
          </button>
          <button
            onClick={showNoteSectionChange}
            className="
    border-b-2 border-blue-500 w-24 text-gray-600 py-4 px-1 block  hover:border-blue-500 hover:text-blue-500 focus:outline-none hover:font-medium"
          >
            Frases
          </button>
        </>
      )}
    </div>
  );
};
