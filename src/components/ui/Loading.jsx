import React from "react";
import "../../styles/loading/_sk-bounce.css";

export const Loading = () => {
  return (
    <>
      <div className="spinner content-center mx-auto my-auto pb-16 animate__animated animate__fadeIn">
        <div className="bounce1 bg-blue-600"></div>
        <div className="bounce2 bg-blue-600"></div>
        <div className="bounce3 bg-blue-600"></div>
      </div>
    </>
  );
};
