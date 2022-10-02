import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

import "./callApp.css";

export default function CallApp() {
  const videoElement = useRef(null);

  const videoConstraints = {
    facingMode: "user",
  };

  return (
    <>
      <div className="cam left">
        <div id="output-cam"></div>
        <div id="cam-params">
          <div id="sticker-select"></div>
          <Webcam
            audio={false}
            ref={videoElement}
            videoConstraints={videoConstraints}
            id="input-cam"
          />
        </div>
      </div>
      <div className="cam right">
        <p className="nickname">Companion</p>
      </div>
    </>
  );
}
