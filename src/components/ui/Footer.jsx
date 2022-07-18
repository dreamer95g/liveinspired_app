import React from "react";

export const Footer = () => {
  return (
    <div>
      <footer className="bg-white dark:bg-gray-800 ">
        <div className="container px-6 py-8 mx-auto ">
          <hr className="my-auto dark:border-gray-500" />

          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <p className=" my-5 mx-auto text-md text-gray-600 text-center content-center">
              © Apoyo Cuba 2021. Todos los derechos reservados
            </p>

            {/* <div className="flex mt-3 -mx-2 sm:mt-0">
                <a href="#" className=" mt-5 mb-5  mx-2 text-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Teams </a>

                <a href="#" className=" mt-5 mb-5  mx-2 text-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Privacy </a>

                <a href="#" className=" mt-5 mb-5  mx-2 text-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Reddit"> Cookies </a>
                        </div> */}
          </div>
          <hr className="my-auto border-2 border-blue-500 dark:border-gray-500" />
        </div>
      </footer>
    </div>
  );
};
