import React from "react";
import "../../styles/loading/_sk-chase-login.css";

export const LoadingAuth = () => {
  return (
    <>
      <div className="sk-chase content-center mx-auto my-8 animate__animated animate__fadeIn">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    </>
  );
};
