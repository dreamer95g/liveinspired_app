import React from "react";
import "../../styles/loading/_sk-chase-dot.css";

export const Loading = () => {
  return (
    <>
      <div className="sk-chase content-center mx-auto my-8">
        <div className="sk-chase-dot "></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
    </>
  );
};
