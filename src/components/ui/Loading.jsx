import React from "react";
import "../../styles/loading/_sk-bounce.css";

export const Loading = () => {
  return (
    <>
      <div className="spinner content-center mx-auto my-6">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </>
  );
};
