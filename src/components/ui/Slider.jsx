import "./ui.css";
import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { url_base } from "../../config/app";

export const Slider = () => {
  const contentStyle = {
    height: "350px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <>
      <Carousel autoplay>
        <div>
          <img
            src={`/src/assets/images/inspired4.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div>
        {/* <div>
          <img
            src={`/src/assets/images/inspired2.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div> */}
        <div>
          <img
            src={`/src/assets/images/inspired1.jpg`}
            className="w-full"
            style={contentStyle}
          />
        </div>
      </Carousel>
    </>
  );
};
